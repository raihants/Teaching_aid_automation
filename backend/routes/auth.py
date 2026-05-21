from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.auth import verify_password, create_access_token, decode_access_token, get_password_hash
from services.db_service import get_connection
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    role: str

def get_user(username: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username, password_hash, role FROM users WHERE username = %s", (username,))
        row = cursor.fetchone()
        if row:
            return {"username": row[0], "password_hash": row[1], "role": row[2]}
        return None
    finally:
        cursor.close()
        conn.close()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"]}

@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    username = payload.get("sub")
    user = get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user["username"], "role": user["role"]}

# Route to list all users (Admin only)
@router.get("/users")
async def list_users(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC")
        rows = cursor.fetchall()
        return [
            {"id": row[0], "username": row[1], "role": row[2], "created_at": row[3].isoformat() if row[3] else None}
            for row in rows
        ]
    finally:
        cursor.close()
        conn.close()

# Route to delete user (Admin only)
@router.delete("/users/{user_id}")
async def delete_user(user_id: int, token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Prevent deleting the current admin themselves if needed, or at least check if user exists
        cursor.execute("DELETE FROM users WHERE id = %s AND username != 'admin'", (user_id,))
        conn.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Error deleting user: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Route to create new users (Admin only)
@router.post("/users")
async def create_user(username: str, password: str, role: str, token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to create users")
    
    hashed_pass = get_password_hash(password)
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
            (username, hashed_pass, role)
        )
        conn.commit()
        return {"message": "User created successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")
    finally:
        cursor.close()
        conn.close()
