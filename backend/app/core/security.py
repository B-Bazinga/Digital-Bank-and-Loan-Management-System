import bcrypt
import jwt 
from datetime import datetime, timedelta, timezone
from app.core.config import settings

# Password Hashing
def hash_password(password: str)-> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'),salt)
    return hashed_password.decode('utf-8')

# Verification Password
def verify_password(plain_password: str, hashed_password: str)-> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

# JWT Token Creation
def create_access_token(data: dict)-> str:
    to_encode = data.copy()
    # Set the expiration time for the token
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp': expire})
    # Encode the token
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt  