from pydantic import BaseModel
from typing import Optional

class Book(BaseModel):
    title: str
    author: Optional[str]
    year: Optional[int]
    cover: Optional[str]