from fastapi import HTTPException
import requests
from utils.database import supabase
from fastapi.responses import JSONResponse
from api.schemas.auths import UserRegister, UserLogin

class AuthService:
    def register_user(user_data: UserRegister):
        try:
            user = supabase.auth.sign_up({
                "email": user_data.email, 
                "password": user_data.password,
                "options": {
                    "data": {
                        "full_name":user_data.full_name
                    }
                }
            })

            if user.user is None: 
                raise HTTPException(status_code=400, detail="Error creating user")

            profile_data = {
                "id": user.user.id,
                "full_name": user_data.full_name,
                "preferences": user_data.preferences 
            }

            profile_response = supabase.table("profiles").insert(profile_data).execute()

            if not profile_response.data:
                raise HTTPException(status_code=400, detail="Error creating profile")
        
            return {
                "message": "User created",
                "user_id": user.user.id,
                "email": user.user.email,
                "preferences": user_data.preferences
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    def login_user(user_data: UserLogin):
        try:
            user = supabase.auth.sign_in_with_password({"email": user_data.email, "password": user_data.password})
            return {"token": user.session.access_token}
        except Exception as e:  
            raise HTTPException(status_code=401, detail="Invalid credentials")