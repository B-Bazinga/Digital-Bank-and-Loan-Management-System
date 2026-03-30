from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_db, close_db_connection
from app.api.routes import api_router
from app.middleware.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.exceptions.handlers import setup_exception_handlers

from app.middleware.logging import LoggingMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_db()
    yield 
    await close_db_connection()

app = FastAPI(
    title=settings.PROJECT_NAME, 
    lifespan=lifespan
)

# 1. Integrate Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 2. Integrate Custom Exception Handlers
setup_exception_handlers(app)

# 3. Add Logging Middleware
app.add_middleware(LoggingMiddleware)

# Register the routers with the main application
app.include_router(api_router, prefix="/api")

# Defining the home page api endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Digital Banking API"}