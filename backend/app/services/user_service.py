from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserUpdate
from app.exceptions.errors import BusinessValidationError, ResourceNotFoundError

class UserService:
    @staticmethod
    async def get_profile(user_id: str) -> dict:
        user = await UserRepository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError("User not found")
        return user

    @staticmethod
    async def update_profile(user_id: str, update_data: UserUpdate) -> dict:
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        if not update_dict:
            raise BusinessValidationError("No fields to update")

        if "email" in update_dict:
            existing = await UserRepository.get_by_email(update_dict["email"])
            if existing and str(existing["_id"]) != user_id:
                raise BusinessValidationError("Email already taken")
                
        await UserRepository.update(user_id, update_dict)
        return await UserRepository.get_by_id(user_id)
