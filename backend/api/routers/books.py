from typing import List
from fastapi import APIRouter, Depends, requests, Query
from services.book_service import BookService
from core.security import get_current_user
from ..schemas.books import Book

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/")
async def list_books(_=Depends(get_current_user)):
    return "test" 
    #BookService.get_all_books()

@router.post("/")
async def add_book(book_data: dict, _=Depends(get_current_user)):
    return BookService.create_book(book_data)

@router.get("/userBooks")
async def list_userBooks(_=Depends(get_current_user)):
    return "test"

@router.get("/catalog", summary="Get general catalog", response_model=List[Book])
async def catalog(page: int = 1):
    return BookService.get_catalog(page)

@router.get("/search", summary="Search books by name and optional genre", response_model=List[Book])
async def search_book(title: str = Query(...), genre:str = Query(None), page:int = Query(1)):
    return BookService.search_books(title, genre, page)