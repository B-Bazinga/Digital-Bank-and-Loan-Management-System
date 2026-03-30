# Defining the connection between Mongo and Redis, following a singleton approach were the clients objects are created at startup and we reuse them. 

from motor.motor_asyncio import AsyncIOMotorClient
from redis.asyncio import Redis
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError

from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None
    redis_client: Redis = None

db_manager = Database()

# Defining the DB connection 
async def connect_to_db():
    # MongoDB Connection
    db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]

    # Redis Connection (used for caching and locks later)
    db_manager.redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

    # Fail fast on startup so credential/network issues are surfaced immediately.
    try:
        await db_manager.client.admin.command("ping")
    except OperationFailure as exc:
        raise RuntimeError(
            "MongoDB Atlas authentication failed. Verify username/password, "
            "URL-encode special characters in password, and confirm the Atlas user has access."
        ) from exc
    except ServerSelectionTimeoutError as exc:
        raise RuntimeError(
            "MongoDB server unreachable. Verify MONGODB_URI/MONGODB_URL and Atlas network access allow list."
        ) from exc

    try:
        await db_manager.redis_client.ping()
    except Exception as exc:
        raise RuntimeError(
            "Redis connection failed. Start Redis locally on port 6379 or update REDIS_URL in backend/.env."
        ) from exc

    print("Successfully connected to MongoDB and Redis.")


async def close_db_connection():
    if db_manager.client:
        db_manager.client.close()

    if db_manager.redis_client:
        await db_manager.redis_client.close()

    print("Database connection is closed...")