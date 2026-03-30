# Defining the user schemas
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from enum import Enum
from typing import Optional
from app.utils.helpers import PyObjectId

# Only approve Request from a certian roles (customer, employee, admin)
class RoleEnum(str, Enum):
    customer = "customer"
    employee = "employee" 
    admin = "admin"

# Use field to set the min and max length of the name
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    role: RoleEnum = RoleEnum.customer

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    
    model_config = ConfigDict(populate_by_name=True)

class UserResponse(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    model_config = ConfigDict(populate_by_name=True)

# Used internally to represent a user stored in the database (includes hashed password)
class UserInDB(UserBase):
    id: PyObjectId = Field(alias="_id")
    password: str

    model_config = ConfigDict(populate_by_name=True)