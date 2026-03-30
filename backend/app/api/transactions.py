from fastapi import APIRouter, Depends
from app.schemas.transaction_schema import TransactionCreate, TransactionResponse
from app.controllers.transactions import TransactionController
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/transfer", response_model=TransactionResponse)
async def transfer_money(from_account_num: str, data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    return await TransactionController.transfer_money(from_account_num, data, current_user)
