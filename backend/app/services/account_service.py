# app/services/account_service.py
from app.schemas.account_schema import AccountCreate, AccountStatus
from app.repositories.account_repository import AccountRepository
from app.utils.helpers import generate_account_number

class AccountService:
    @staticmethod
    async def create_account(user_id: str, data: AccountCreate) -> dict:
        
        account_dict = {
            "user_id": user_id,
            "account_number": generate_account_number(),
            "balance": data.initial_deposit,
            "status": AccountStatus.active.value
        }
        
        # Pass it down to the repository to save [cite: 309]
        return await AccountRepository.create_account(account_dict)