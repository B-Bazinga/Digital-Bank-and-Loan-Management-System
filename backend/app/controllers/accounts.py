from app.schemas.account_schema import AccountCreate
from app.services.account_service import AccountService

class AccountController:
    @staticmethod
    async def create_account(data: AccountCreate, current_user: dict):
        return await AccountService.create_account(str(current_user["_id"]), data)
