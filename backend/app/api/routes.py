import app.api.auth as auth_router
import app.api.users as users_router
import app.api.accounts as accounts_router
import app.api.transactions as transactions_router
import app.api.loans as loans_router
import app.api.admin as admin_router

from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(auth_router.router)
api_router.include_router(users_router.router)
api_router.include_router(accounts_router.router)
api_router.include_router(transactions_router.router)
api_router.include_router(loans_router.router)
api_router.include_router(admin_router.router)
