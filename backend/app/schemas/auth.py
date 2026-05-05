from pydantic import BaseModel, EmailStr
from typing import Literal


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    success: bool
    role: Literal["user", "admin"]


class UserInfo(BaseModel):
    id: str
    email: str
    role: str


class MeResponse(BaseModel):
    user: UserInfo | None
