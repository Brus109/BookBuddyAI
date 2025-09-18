from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils.database import supabase
from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register")
async def register(user_data: UserRegister):
    try:
        user = supabase.auth.sign_up({"email": user_data.email, "password": user_data.password})
        return {"message": "User created"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user_data: UserLogin):
    try:
        user = supabase.auth.sign_in_with_password({"email": user_data.email, "password": user_data.password})
        return {"token": user.session.access_token}
    except Exception as e:  
        raise HTTPException(status_code=401, detail="Invalid credentials")