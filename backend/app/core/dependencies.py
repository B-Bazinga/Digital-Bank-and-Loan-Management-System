# app/core/dependencies.py
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from app.core.config import settings
from app.core.database import db_manager
from app.schemas.user_schema import RoleEnum

# This tells FastAPI where the client should go to get a token.
# It automatically integrates with FastAPI's /docs Swagger UI!
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    # Decodes the JWT, verifies it, and fetches the user from MongoDB.
    # This acts as our base authentication dependency.

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    # Fetch user from database
    user = await db_manager.db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception

    # Handle the specific capstone requirement: Employees need Admin approval to log in
    if user.get("role") == RoleEnum.employee and not user.get("is_approved", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employee account pending admin approval."
        )

    return user

class RoleChecker:
    # A dependency class used for Role-Based Access Control (RBAC).
    def __init__(self, allowed_roles: list[RoleEnum]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_user)):
        if user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )
        return user

# Pre-configured dependencies for easy use in our route controllers
require_admin = RoleChecker([RoleEnum.admin])
# Admins can often do employee tasks
require_employee = RoleChecker([RoleEnum.employee, RoleEnum.admin]) 
require_customer = RoleChecker([RoleEnum.customer])