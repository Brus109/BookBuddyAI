from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils.database import supabase

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register")
async def register(email: str, password: str):
    try:
        user = supabase.auth.sign_up({"email": email, "password": password})
        return {"message": "User created"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(email: str, password: str):
    try:
        user = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return {"token": user.session.access_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")