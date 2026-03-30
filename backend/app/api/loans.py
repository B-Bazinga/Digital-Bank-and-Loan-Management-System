from fastapi import APIRouter, Depends
from app.schemas.loan_schema import LoanCreate, LoanResponse
from app.controllers.loans import LoanController
from app.core.dependencies import get_current_user, require_customer, require_employee

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("/apply", response_model=LoanResponse, dependencies=[Depends(require_customer)])
async def apply_for_loan(data: LoanCreate, current_user: dict = Depends(get_current_user)):
    return await LoanController.apply_for_loan(data, current_user)

@router.get("")
async def view_all_loans(current_user: dict = Depends(get_current_user)):
    return await LoanController.view_all_loans(current_user)

@router.put("/{loan_id}/approve", dependencies=[Depends(require_employee)])
async def approve_loan(loan_id: str):
    return await LoanController.approve_loan(loan_id)

@router.put("/{loan_id}/reject", dependencies=[Depends(require_employee)])
async def reject_loan(loan_id: str):
    return await LoanController.reject_loan(loan_id)
