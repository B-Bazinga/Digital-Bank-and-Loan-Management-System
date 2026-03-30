from fastapi import APIRouter, Depends
from app.schemas.account_schema import AccountCreate, AccountResponse
from app.controllers.accounts import AccountController
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.post("", response_model=AccountResponse)
async def create_account(data: AccountCreate, current_user: dict = Depends(get_current_user)):
    return await AccountController.create_account(data, current_user)
