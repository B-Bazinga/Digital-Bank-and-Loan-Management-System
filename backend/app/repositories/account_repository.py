from app.core.database import db_manager

class AccountRepository:
    @staticmethod
    async def create_account(account_data: dict):
        # Insert a new account into MongoDB
        result = await db_manager.db.accounts.insert_one(account_data)
        account_data["_id"] = result.inserted_id
        return account_data

    @staticmethod
    async def get_account_by_number(account_number: str):
        return await db_manager.db.accounts.find_one({"account_number": account_number})

    # Alias used by transaction_service
    get_by_account_number = get_account_by_number

    @staticmethod
    async def update_account(account_number: str, update_data: dict):
        await db_manager.db.accounts.update_one(
            {"account_number": account_number},
            {"$set": update_data}
        )
        return await db_manager.db.accounts.find_one({"account_number": account_number})

    @staticmethod
    async def update_balance(account_number: str, new_balance: float):
        """Update just the balance field for an account."""
        await db_manager.db.accounts.update_one(
            {"account_number": account_number},
            {"$set": {"balance": new_balance}}
        )