import requests
from utils.database import supabase
from api.schemas.books import Book 
from fastapi.responses import JSONResponse
 

class BookService:
    @staticmethod
    def get_all_books():
        return supabase.table("books").select("*").execute()

    @staticmethod
    def create_book(book_data: dict):
        return supabase.table("books").insert(book_data).execute()
    
    def get_catalog(page:int):
        url = f"https://openlibrary.org/search.json?q=book&page={page}" 
        response = requests.get(url)

        if response.status_code != 200:
            return JSONResponse(status_code = 500, content = {"Error":"Error when querying Open Library"})
    
        data = response.json()
        return [
            Book(
                title=book.get("title"),
                author=book.get("author_name", ["Unknown"])[0],
                year=book.get("first_publish_year"),
                cover=f"https://covers.openlibrary.org/b/id/{book.get('cover_i')}-M.jpg"
                if book.get("cover_i") else None
            )
            for book in data.get("docs", [])[:20]
        ]
    
    def search_books(title:str, genre:str = None, page:int = 1):
        url = "https://openlibrary.org/search.json"
        params = { "title":title, "page":page}
        if genre:
            params["subject"] = genre

        response = requests.get(url, params=params)
        if(response.status_code != 200):
            return JSONResponse(status_code=500, content={"Error":"Error Querying Open Library"})
        
        data = response.json()
        return [
            Book(
                title=book.get("title"),
                author=book.get("author_name", ["Unknown"])[0],
                year=book.get("first_publish_year"),
                cover=f"https://covers.openlibrary.org/b/id/{book.get('cover_i')}-M.jpg"
                if book.get("cover_i") else None
            )
            for book in data.get("docs", [])[:20]
        ]