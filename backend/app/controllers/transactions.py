from app.schemas.transaction_schema import TransactionCreate
from app.services.transaction_service import TransactionService

class TransactionController:
    @staticmethod
    async def transfer_money(from_account_num: str, data: TransactionCreate, current_user: dict):
        return await TransactionService.transfer_money(from_account_num, data)
