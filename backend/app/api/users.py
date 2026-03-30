from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserUpdate, UserResponse
from app.controllers.users import UserController
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return await UserController.get_profile(current_user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    return await UserController.update_profile(update_data, current_user)
