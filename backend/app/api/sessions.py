import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.deps import get_db, get_current_user
from app.models.orm import User, AnalysisSession
from app.schemas.analysis import SessionListItem, SessionDetail

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _to_list_item(s: AnalysisSession) -> SessionListItem:
    try:
        profile = json.loads(s.music_profile)
        summary = profile.get("summary", s.input_text[:40])
    except Exception:
        summary = s.input_text[:40]
    return SessionListItem(
        id=s.id,
        input_text=s.input_text,
        summary=summary,
        created_at=s.created_at.isoformat() if s.created_at else "",
        is_mock=s.is_mock or False,
    )


def _to_detail(s: AnalysisSession) -> SessionDetail:
    try:
        profile = json.loads(s.music_profile)
    except Exception:
        profile = {}
    try:
        explanation = json.loads(s.explanation)
    except Exception:
        explanation = {}
    return SessionDetail(
        id=s.id,
        input_text=s.input_text,
        music_profile=profile,
        explanation=explanation,
        image_url=s.image_url,
        is_mock=s.is_mock or False,
        created_at=s.created_at.isoformat() if s.created_at else "",
    )


@router.get("", response_model=list[SessionListItem])
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AnalysisSession)
        .where(AnalysisSession.user_id == current_user.id)
        .order_by(AnalysisSession.created_at.desc())
        .limit(100)
    )
    sessions = result.scalars().all()
    return [_to_list_item(s) for s in sessions]


@router.get("/search", response_model=list[SessionListItem])
async def search_sessions(
    q: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AnalysisSession)
        .where(
            AnalysisSession.user_id == current_user.id,
            AnalysisSession.input_text.contains(q),
        )
        .order_by(AnalysisSession.created_at.desc())
        .limit(50)
    )
    sessions = result.scalars().all()
    return [_to_list_item(s) for s in sessions]


@router.get("/{session_id}", response_model=SessionDetail)
async def get_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")
    return _to_detail(session)


@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AnalysisSession).where(
            AnalysisSession.id == session_id,
            AnalysisSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")
    await db.delete(session)
    await db.commit()
    return {"success": True}
