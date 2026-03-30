from app.core.database import db_manager

class TransactionRepository:
    @staticmethod
    async def create(transaction_data: dict) -> dict:
        result = await db_manager.db.transactions.insert_one(transaction_data)
        transaction_data["_id"] = result.inserted_id
        return transaction_data
