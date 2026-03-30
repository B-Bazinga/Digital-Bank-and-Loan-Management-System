# app/schemas/transaction_schema.py
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.utils.helpers import PyObjectId

class TransactionCreate(BaseModel):
    to_account: str = Field(..., description="Destination account number")
    amount: float = Field(..., gt=0, description="Transfer amount must be positive")

class TransactionResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    from_account: str
    to_account: str
    amount: float
    status: str
    timestamp: datetime

    model_config = ConfigDict(populate_by_name=True)
