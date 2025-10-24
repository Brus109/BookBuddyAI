from fastapi import HTTPException
import requests
from utils.database import supabase
from api.schemas.books import Book, SaveBook
from uuid import UUID
from fastapi.responses import JSONResponse
from bs4 import BeautifulSoup

class BookService:
    @staticmethod
    def get_all_books(user_id: UUID):
        response = supabase.table("user_books").select("*").eq("user_id", user_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="No books found for this user")
        
        return response.data

    def save_book(book_data: SaveBook, user_id: UUID):
        try:
            book_structure = {
                "user_id":user_id,
                "book_id":book_data.book_id,
                "status": book_data.status,
                "rating":book_data.rating,
                "review":book_data.review
            }
            book_response = supabase.table("user_books").insert(book_structure).execute()

            if not book_response.data:
                raise HTTPException(status_code=400, detail="Error creating book")
            
            return {
                "message": "book save",
                "data": book_response.data[0]
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    
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
                if book.get("cover_i") else None,
                workId=book.get("key").split("/")[-1] if book.get("key", "").startswith("/works/") else None
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
                if book.get("cover_i") else None,
                workId=book.get("key").split("/")[-1] if book.get("key", "").startswith("/works/") else None
            )
            for book in data.get("docs", [])[:20]
        ]
    
    def rating(id:str):
        url = f"https://openlibrary.org/works/{id}/ratings.json"
        response = requests.get(url)
        if response.status_code != 200:
            return None
        data = response.json()
        return data.get("summary", {}).get("average")
        
    def scrape_genres():
        url = "https://openlibrary.org/subjects.en"
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception("Failed to fetch subjects page")
        
        soup = BeautifulSoup(response.text, "html.parser")
        genre_section = soup.find("div", id="subjectsPage")

        genres = []

        if genre_section:
            for ul in genre_section.find_all("ul"):
                for li in ul.find_all("li"):
                    link = li.find("a")
                    if link and link.get("href", "").startswith("/subjects/"):
                        genres.append({
                            "name": link.text.strip(),
                            "slug": link.get("href").split("/")[-1],
                            "url": f"https://openlibrary.org{link.get('href')}"
                        })

        return genres