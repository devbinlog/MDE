import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.deps import get_db, get_optional_user, COOKIE_NAME
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import get_settings
from app.models.orm import User
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, MeResponse, UserInfo

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

COOKIE_MAX_AGE = 7 * 24 * 3600  # 7 days


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,   # set True in production behind HTTPS
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        path="/",
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, response: Response, db: AsyncSession = Depends(get_db)):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="비밀번호는 6자 이상이어야 합니다.")

    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="이미 사용 중인 이메일입니다.")

    user_id = secrets.token_hex(16)
    user = User(
        id=user_id,
        email=body.email,
        password_hash=hash_password(body.password),
        role="user",
    )
    db.add(user)
    await db.commit()

    token = create_access_token(user_id, body.email, "user")
    _set_auth_cookie(response, token)
    return AuthResponse(success=True, role="user")


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    # Admin account via env vars
    if body.email == settings.admin_email and body.password == settings.admin_password:
        # Look up by fixed id='admin' first, then by email
        result = await db.execute(select(User).where(User.id == "admin"))
        admin = result.scalar_one_or_none()
        if admin:
            # Update email if it changed (e.g. fmd.dev → mde.dev)
            if admin.email != body.email:
                admin.email = body.email
                await db.commit()
        else:
            # Also check by email in case created with different id
            result2 = await db.execute(select(User).where(User.email == body.email))
            admin = result2.scalar_one_or_none()
            if not admin:
                admin = User(
                    id="admin",
                    email=body.email,
                    password_hash=hash_password(body.password),
                    role="admin",
                )
                db.add(admin)
                await db.commit()
        token = create_access_token("admin", body.email, "admin")
        _set_auth_cookie(response, token)
        return AuthResponse(success=True, role="admin")

    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

    token = create_access_token(user.id, user.email, user.role)
    _set_auth_cookie(response, token)
    return AuthResponse(success=True, role=user.role)  # type: ignore[arg-type]


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"success": True}


@router.get("/me", response_model=MeResponse)
async def me(user: User | None = Depends(get_optional_user)):
    if user is None:
        return MeResponse(user=None)
    return MeResponse(user=UserInfo(id=user.id, email=user.email, role=user.role))
