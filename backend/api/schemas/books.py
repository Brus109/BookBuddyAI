from pydantic import BaseModel
from typing import Optional

class Book(BaseModel):
    title: str
    author: Optional[str]
    year: Optional[int]
    cover: Optional[str]
    workId: Optional[str]

class SaveBook(BaseModel):
    book_id: str
    status: Optional[str]
    rating: Optional[int]
    review: Optional[str]
