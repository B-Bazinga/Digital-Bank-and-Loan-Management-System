from app.repositories.user_repository import UserRepository
from app.repositories.loan_repository import LoanRepository
from app.exceptions.errors import ResourceNotFoundError

class AdminService:
    @staticmethod
    async def get_customers() -> list:
        customers = await UserRepository.get_all({"role": "customer"})
        for c in customers:
            c["_id"] = str(c["_id"])
            c.pop("password", None)
        return customers

    @staticmethod
    async def approve_employee(employee_id: str) -> bool:
        success = await UserRepository.update(employee_id, {"is_approved": True})
        if not success:
            raise ResourceNotFoundError("Employee not found or already approved")
        return True

    @staticmethod
    async def delete_user(user_id: str) -> bool:
        success = await UserRepository.delete(user_id)
        if not success:
            raise ResourceNotFoundError("User not found")
        return True

    @staticmethod
    async def get_system_reports() -> dict:
        return {
            "users": await UserRepository.count(),
            "customers": await UserRepository.count({"role": "customer"}),
            "employees": await UserRepository.count({"role": "employee"}),
            "total_loans": await LoanRepository.count(),
            "total_loan_amount": await LoanRepository.aggregate_sum("amount"),
        }
