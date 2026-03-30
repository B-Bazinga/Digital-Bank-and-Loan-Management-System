from pydantic import BaseModel, Field
from datetime import datetime
from typing import List
from app.utils.helpers import PyObjectId

class AccountModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    account_number: str
    user_id: str
    balance: float
    status: str
    created_at: datetime
    transaction_history: List[str]

    class Config:
        populate_by_name = True
