from typing import List
from fastapi import APIRouter, Depends, requests, Query
from services.book_service import BookService
from core.security import get_current_user
from ..schemas.books import Book, SaveBook

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/get_favorites", response_model = List[SaveBook])
async def list_books():
    user_id = "58ea9613-bb71-4fe7-915f-94f4ca460869"
    return BookService.get_all_books(user_id)

@router.post("/save")
async def add_book(book_data: SaveBook, user=Depends(get_current_user)):
    user_id = user.id
    return BookService.save_book(book_data, user_id)

@router.delete("/delete_book/{book_id}")
async def delete_book(book_id: str):
    user_id = "58ea9613-bb71-4fe7-915f-94f4ca460869"
    return BookService.delete_book(user_id, book_id)

@router.get("/userBooks")
async def list_userBooks(_=Depends(get_current_user)):
    return "test"

@router.get("/catalog", summary="Get general catalog", response_model=List[Book])
async def catalog(page: int = 1):
    return BookService.get_catalog(page)

@router.get("/search", summary="Search books by name and optional genre", response_model=List[Book])
async def search_book(title: str = Query(...), genre:str = Query(None), page:int = Query(1)):
    return BookService.search_books(title, genre, page)

@router.get("/rating")
async def rating_by_book(id: str = Query(...)):
    return BookService.rating(id)

@router.get("/genres")
async def get_genres():
    return BookService.scrape_genres()