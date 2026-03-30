from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from app.utils.helpers import PyObjectId

class UserModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    role: str
    password: str
    is_approved: Optional[bool] = None

    class Config:
        populate_by_name = True
