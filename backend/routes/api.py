from services.db_service import get_history
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"status": "backend running"}

@router.get("/history")
def history(workcenter: str = None, limit: int = 50):
    data = get_history(workcenter, limit)
    return {
        "status": "success",
        "data": data
    }