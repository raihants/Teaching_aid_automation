from services.db_service import get_history, get_production_history, get_mo_detail, get_mo_history, finish_mo
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"status": "backend running"}

@router.get("/history")
def history(
    limit: int = 20,
    search: str = None,
    result: str = None
):
    data = get_history(
        search=search,
        result_filter=result,
        limit=limit
    )
    return {"data": data}
    
@router.get("/production_history")
def production_history(
    limit: int = 20,
    search: str = None,
    result: str = None
):
    data = get_production_history(
        search=search,
        result_filter=result,
        limit=limit
    )
    return {"data": data}

@router.get("/mo_detail/{mo_id}")
def mo_detail(mo_id: int):
    data = get_mo_detail(mo_id)

    if not data:
        return {
            "status": "error",
            "message": "MO not found",
        }

    return {
        "status": "success",
        "data": data
    }

@router.get("/mo_history")
def mo_history(
    limit: int = 20,
    search: str = None,
    result: str = None
):
    data = get_mo_history(
        search=search,
        result_filter=result,
        limit=limit
    )

    if not data:
        return {
            "status": "error",
            "message": "MO not found",
        }

    return {
        "status": "success",
        "data": data
    }