from utils.database import supabase

class BookService:
    @staticmethod
    def get_all_books():
        return supabase.table("books").select("*").execute()

    @staticmethod
    def create_book(book_data: dict):
        return supabase.table("books").insert(book_data).execute()