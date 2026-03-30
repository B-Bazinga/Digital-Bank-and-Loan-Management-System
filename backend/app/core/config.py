# Configuring all the api keys in this file 
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str 
    MONGODB_URL: str = Field(validation_alias=AliasChoices("MONGODB_URL", "MONGODB_URI"))
    DATABASE_NAME: str 
    REDIS_URL: str 
    SECRET_KEY: str
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int

settings = Settings()