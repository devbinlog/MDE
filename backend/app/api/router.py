from fastapi import APIRouter

from app.api import auth, analyze, sessions, share, admin

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(analyze.router)
api_router.include_router(sessions.router)
api_router.include_router(share.router)
api_router.include_router(admin.router)


@api_router.get("/health", tags=["health"])
async def health():
    from app.core.config import get_settings
    s = get_settings()
    return {
        "status": "ok",
        "llm_provider": s.llm_provider,
        "llm_model": s.llm_model,
        "demo_mode": not bool(s.llm_api_key),
    }
