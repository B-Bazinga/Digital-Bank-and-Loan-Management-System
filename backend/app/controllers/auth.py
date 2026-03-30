from app.schemas.user_schema import UserCreate
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm
from app.services.user_service import UserService

class AuthController:
    @staticmethod
    async def register(user_data: UserCreate):
        return await AuthService.register(user_data)

    @staticmethod
    async def login(form_data: OAuth2PasswordRequestForm):
        access_token = await AuthService.login(form_data.username, form_data.password)
        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    async def get_me(user: dict):
        # Already authenticated via dependency, just map it.
        return user
