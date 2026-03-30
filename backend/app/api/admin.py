from fastapi import APIRouter, Depends
from app.controllers.admin import AdminController
from app.core.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])

@router.get("/customers")
async def view_all_customers():
    return await AdminController.view_all_customers()

@router.put("/employees/{employee_id}/approve")
async def approve_employee(employee_id: str):
    return await AdminController.approve_employee(employee_id)

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    return await AdminController.delete_user(user_id)

@router.get("/reports")
async def get_system_reports():
    return await AdminController.get_system_reports()
