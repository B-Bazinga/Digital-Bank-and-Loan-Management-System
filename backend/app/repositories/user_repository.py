from app.core.database import db_manager
from bson import ObjectId

class UserRepository:
    @staticmethod
    async def create(user_data: dict) -> dict:
        result = await db_manager.db.users.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return user_data

    @staticmethod
    async def get_by_email(email: str) -> dict:
        return await db_manager.db.users.find_one({"email": email})

    @staticmethod
    async def get_by_id(user_id: str) -> dict:
        return await db_manager.db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    async def update(user_id: str, update_data: dict) -> bool:
        result = await db_manager.db.users.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_data}
        )
        return result.modified_count > 0

    @staticmethod
    async def delete(user_id: str) -> bool:
        result = await db_manager.db.users.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    @staticmethod
    async def count(query: dict = {}) -> int:
        return await db_manager.db.users.count_documents(query)

    @staticmethod
    async def get_all(query: dict = {}, limit: int = 100) -> list:
        cursor = db_manager.db.users.find(query)
        return await cursor.to_list(length=limit)
