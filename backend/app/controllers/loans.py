from app.schemas.loan_schema import LoanCreate, LoanStatus
from app.services.loan_service import LoanService

class LoanController:
    @staticmethod
    async def apply_for_loan(data: LoanCreate, current_user: dict):
        return await LoanService.apply_for_loan(str(current_user["_id"]), data)

    @staticmethod
    async def view_all_loans(current_user: dict):
        return await LoanService.get_all_loans(current_user.get("role"), str(current_user["_id"]))

    @staticmethod
    async def approve_loan(loan_id: str):
        await LoanService.set_loan_status(loan_id, LoanStatus.approved.value)
        return {"message": "Loan approved"}

    @staticmethod
    async def reject_loan(loan_id: str):
        await LoanService.set_loan_status(loan_id, LoanStatus.rejected.value)
        return {"message": "Loan rejected"}
