from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user_schema import UserCreate
from app.exceptions.errors import BusinessValidationError, AuthenticationError

class AuthService:
    @staticmethod
    async def register(user_data: UserCreate) -> dict:
        existing_user = await UserRepository.get_by_email(user_data.email)
        if existing_user:
            raise BusinessValidationError("Email already registered")

        new_user = user_data.model_dump()
        new_user["password"] = hash_password(user_data.password)
        
        return await UserRepository.create(new_user)

    @staticmethod
    async def login(email: str, password: str) -> str:
        user = await UserRepository.get_by_email(email)
        if not user or not verify_password(password, user["password"]):
            raise AuthenticationError("Incorrect email or password")
            
        return create_access_token(data={"sub": str(user["_id"])})
