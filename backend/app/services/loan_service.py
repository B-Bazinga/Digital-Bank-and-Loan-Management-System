from app.repositories.loan_repository import LoanRepository
from app.schemas.loan_schema import LoanCreate, LoanStatus
from app.exceptions.errors import ResourceNotFoundError

class LoanService:
    @staticmethod
    async def apply_for_loan(user_id: str, data: LoanCreate) -> dict:
        loan_record = {
            "user_id": user_id,
            "amount": data.amount,
            "status": LoanStatus.pending.value
        }
        return await LoanRepository.create(loan_record)

    @staticmethod
    async def get_all_loans(user_role: str, user_id: str) -> list:
        if user_role == "customer":
            loans = await LoanRepository.get_all({"user_id": user_id})
        else:
            loans = await LoanRepository.get_all()
            
        for loan in loans:
            loan["_id"] = str(loan["_id"])
        return loans

    @staticmethod
    async def set_loan_status(loan_id: str, status: str) -> bool:
        success = await LoanRepository.update_status(loan_id, status)
        if not success:
            raise ResourceNotFoundError("Loan not found")
        return True
