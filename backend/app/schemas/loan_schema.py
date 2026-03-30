# app/schemas/loan_schema.py
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from app.utils.helpers import PyObjectId

class LoanStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class LoanCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Loan amount must be positive")

class LoanResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    amount: float
    status: LoanStatus

    model_config = ConfigDict(populate_by_name=True)