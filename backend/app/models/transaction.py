from pydantic import BaseModel, Field
from datetime import datetime
from app.utils.helpers import PyObjectId

class TransactionModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    from_account: str
    to_account: str
    amount: float
    timestamp: datetime
    status: str

    class Config:
        populate_by_name = True
