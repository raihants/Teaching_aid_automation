from services.db_service import get_connection
from core.auth import get_password_hash
import sys
import os

# Add parent directory to path to allow importing from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def setup_users_table():
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Create users table
        print("Creating users table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'operator',
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Check if admin already exists
        cursor.execute("SELECT id FROM users WHERE username = 'admin';")
        if cursor.fetchone():
            print("Admin user already exists.")
        else:
            print("Seeding admin user...")
            admin_pass = "admin123"
            hashed_pass = get_password_hash(admin_pass)
            cursor.execute("""
                INSERT INTO users (username, password_hash, role)
                VALUES (%s, %s, %s)
            """, ("admin", hashed_pass, "admin"))
            print(f"Admin user created with username: admin and password: {admin_pass}")
            
        conn.commit()
        print("Database setup completed successfully.")
        
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Database setup failed: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    setup_users_table()
