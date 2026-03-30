from pydantic import BaseModel, Field
from app.utils.helpers import PyObjectId

class LoanModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    amount: float
    status: str

    class Config:
        populate_by_name = True
