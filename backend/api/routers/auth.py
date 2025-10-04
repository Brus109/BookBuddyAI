from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils.database import supabase
from ..schemas.auths import UserRegister, UserLogin
from services.auth_service import AuthService 

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register")
async def register(user_data: UserRegister):
    return AuthService.register_user(user_data)

@router.post("/login")
async def login(user_data: UserLogin):
    return AuthService.login_user(user_data)