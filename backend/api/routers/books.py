from fastapi import APIRouter

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/test")
def test_router():
    return {"message": "¡Router de libros funcionando!"}