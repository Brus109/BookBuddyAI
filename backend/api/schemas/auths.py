from pydantic import BaseModel
from typing import Dict

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    preferences: Dict = {} 

class UserLogin(BaseModel):
    email: str
    password: str