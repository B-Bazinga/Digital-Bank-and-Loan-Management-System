from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from app.utils.helpers import PyObjectId

class AccountStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    frozen = "frozen"

# To ensure that it cannot edit it's bank account we have seperated AccountCreate and AccountResponse

# AccountCreate is used to create an account (only initial deposit is required)
class AccountCreate(BaseModel):
    initial_deposit: float = Field(..., ge=0, description="Initial deposit must be greater than 0")

# AccountResponse is used to return an account (all fields)
class AccountResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    account_number: str
    balance: float
    status: AccountStatus

    model_config = ConfigDict(populate_by_name=True)