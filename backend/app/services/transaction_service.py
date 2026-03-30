from datetime import datetime, timezone
from app.core.database import db_manager
from app.schemas.transaction_schema import TransactionCreate
from app.repositories.account_repository import AccountRepository
from app.repositories.transaction_repository import TransactionRepository
from app.exceptions.errors import BusinessValidationError, ResourceNotFoundError

class TransactionService:
    @staticmethod
    async def transfer_money(from_account_num: str, data: TransactionCreate) -> dict:
        # 1. Acquire a Redis Lock for the sender's account 
        lock_name = f"lock:account:{from_account_num}"
        lock = db_manager.redis_client.lock(lock_name, timeout=5)
        
        acquired = await lock.acquire(blocking_timeout=2)
        if not acquired:
            raise BusinessValidationError("Account is currently busy processing another transaction. Please try again.")

        try:
            # 2. Fetch Accounts
            sender = await AccountRepository.get_by_account_number(from_account_num)
            receiver = await AccountRepository.get_by_account_number(data.to_account)

            if not sender or not receiver:
                raise ResourceNotFoundError("Sender or receiver account not found")
            
            if sender["status"] != "active" or receiver["status"] != "active":
                raise BusinessValidationError("One or both accounts are frozen")

            # 3. Check Balance
            if sender["balance"] < data.amount:
                raise BusinessValidationError("Insufficient funds")

            # 4. Perform the Math
            new_sender_balance = sender["balance"] - data.amount
            new_receiver_balance = receiver["balance"] + data.amount

            # 5. Update Database via Repository
            await AccountRepository.update_balance(from_account_num, new_sender_balance)
            await AccountRepository.update_balance(data.to_account, new_receiver_balance)

            # 6. Record the Transaction
            transaction_record = {
                "from_account": from_account_num,
                "to_account": data.to_account,
                "amount": data.amount,
                "status": "success",
                "timestamp": datetime.now(timezone.utc)
            }
            return await TransactionRepository.create(transaction_record)

        finally:
            await lock.release()