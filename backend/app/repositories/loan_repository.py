from app.core.database import db_manager
from bson import ObjectId

class LoanRepository:
    @staticmethod
    async def create(loan_data: dict) -> dict:
        result = await db_manager.db.loans.insert_one(loan_data)
        loan_data["_id"] = result.inserted_id
        return loan_data

    @staticmethod
    async def get_all(query: dict = {}, limit: int = 100) -> list:
        cursor = db_manager.db.loans.find(query)
        return await cursor.to_list(length=limit)

    @staticmethod
    async def update_status(loan_id: str, status: str) -> bool:
        result = await db_manager.db.loans.update_one(
            {"_id": ObjectId(loan_id)}, {"$set": {"status": status}}
        )
        return result.modified_count > 0

    @staticmethod
    async def count(query: dict = {}) -> int:
        return await db_manager.db.loans.count_documents(query)
        
    @staticmethod
    async def aggregate_sum(param_field: str) -> float:
        pipeline = [{"$group": {"_id": None, "total_value": {"$sum": f"${param_field}"}}}]
        cursor = db_manager.db.loans.aggregate(pipeline)
        aggregation = await cursor.to_list(length=1)
        return aggregation[0]["total_value"] if aggregation else 0
