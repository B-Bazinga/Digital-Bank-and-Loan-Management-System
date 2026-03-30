from app.schemas.user_schema import UserUpdate
from app.services.user_service import UserService

class UserController:
    @staticmethod
    async def get_profile(current_user: dict):
        return await UserService.get_profile(str(current_user["_id"]))

    @staticmethod
    async def update_profile(update_data: UserUpdate, current_user: dict):
        return await UserService.update_profile(str(current_user["_id"]), update_data)
