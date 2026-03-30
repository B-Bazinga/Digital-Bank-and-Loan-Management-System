from app.services.admin_service import AdminService

class AdminController:
    @staticmethod
    async def view_all_customers():
        return await AdminService.get_customers()

    @staticmethod
    async def approve_employee(employee_id: str):
        await AdminService.approve_employee(employee_id)
        return {"message": "Employee approved successfully"}

    @staticmethod
    async def delete_user(user_id: str):
        await AdminService.delete_user(user_id)
        return {"message": "User deleted successfully"}

    @staticmethod
    async def get_system_reports():
        return await AdminService.get_system_reports()
