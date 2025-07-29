from pydantic import BaseModel

class BookBase(BaseModel):
    title: str
    author: str
