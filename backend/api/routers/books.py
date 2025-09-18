from fastapi import APIRouter, Depends
from services.book_service import BookService
from core.security import get_current_user

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/")
async def list_books(_=Depends(get_current_user)):
    return "test" 
    #BookService.get_all_books()

@router.post("/")
async def add_book(book_data: dict, _=Depends(get_current_user)):
    return BookService.create_book(book_data)