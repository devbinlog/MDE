from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./fmd.db"

    jwt_secret: str = "fmd_fallback_secret_dev"
    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 7

    admin_email: str = "admin@fmd.dev"
    admin_password: str = "fmd_admin_2026"

    llm_provider: str = "gemini"
    llm_model: str = "gemini-2.0-flash"
    llm_api_key: str = ""

    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
