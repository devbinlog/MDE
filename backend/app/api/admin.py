import json

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.deps import get_db, get_admin_user
from app.models.orm import User, AnalysisSession, Share

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    # User count
    user_count_result = await db.execute(select(func.count(User.id)))
    total_users = user_count_result.scalar_one()

    # Session count
    session_count_result = await db.execute(select(func.count(AnalysisSession.id)))
    total_sessions = session_count_result.scalar_one()

    # Share stats
    share_stats_result = await db.execute(
        select(func.count(Share.id), func.sum(Share.view_count))
    )
    share_row = share_stats_result.one()
    total_shares = share_row[0] or 0
    total_views = share_row[1] or 0

    # Recent shares
    recent_shares_result = await db.execute(
        select(Share, AnalysisSession)
        .join(AnalysisSession, Share.session_id == AnalysisSession.id)
        .order_by(Share.created_at.desc())
        .limit(20)
    )
    recent_shares = []
    for share, session in recent_shares_result.all():
        try:
            profile = json.loads(session.music_profile)
            preview = profile.get("summary", session.input_text[:40])
        except Exception:
            preview = session.input_text[:40]
        recent_shares.append({
            "id": share.id,
            "viewCount": share.view_count,
            "createdAt": share.created_at.isoformat() if share.created_at else "",
            "preview": preview,
        })

    return {
        "stats": {
            "totalUsers": total_users,
            "totalSessions": total_sessions,
            "totalShares": total_shares,
            "totalViews": total_views,
        },
        "recentShares": recent_shares,
    }


@router.get("/sessions")
async def get_all_sessions(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    result = await db.execute(
        select(AnalysisSession).order_by(AnalysisSession.created_at.desc()).limit(100)
    )
    sessions = result.scalars().all()
    return [
        {
            "id": s.id,
            "userId": s.user_id,
            "inputText": s.input_text[:80],
            "isMock": s.is_mock,
            "createdAt": s.created_at.isoformat() if s.created_at else "",
        }
        for s in sessions
    ]
