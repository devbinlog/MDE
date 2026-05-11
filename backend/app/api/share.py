import json
import secrets
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.deps import get_db, get_optional_user, get_admin_user
from app.core.config import get_settings
from app.models.orm import User, AnalysisSession, Share
from app.schemas.analysis import ShareCreateRequest, ShareResponse, ShareDetailResponse

router = APIRouter(prefix="/share", tags=["share"])
settings = get_settings()


def _generate_share_id() -> str:
    ts = int(time.time() * 1000)
    rand = secrets.token_hex(3)
    return f"s_{ts:x}_{rand}"


@router.post("", response_model=ShareResponse)
async def create_share(
    body: ShareCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    # If session_id provided, look it up; otherwise require inline data
    if body.session_id:
        result = await db.execute(
            select(AnalysisSession).where(AnalysisSession.id == body.session_id)
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")
        session_id = session.id
    elif body.music_profile and body.explanation:
        # Create an anonymous session to hold this data
        session_id = f"analysis_{int(time.time() * 1000)}_{secrets.token_hex(4)}"
        new_session = AnalysisSession(
            id=session_id,
            user_id=current_user.id if current_user else None,
            input_text=body.input or "",
            music_profile=json.dumps(body.music_profile, ensure_ascii=False),
            explanation=json.dumps(body.explanation, ensure_ascii=False),
            is_mock=False,
        )
        db.add(new_session)
        await db.flush()
    else:
        raise HTTPException(status_code=400, detail="session_id 또는 music_profile+explanation이 필요합니다.")

    share_id = _generate_share_id()
    share = Share(id=share_id, session_id=session_id, view_count=0)
    db.add(share)
    await db.commit()

    base_url = settings.frontend_url
    return ShareResponse(success=True, id=share_id, url=f"{base_url}/shared/{share_id}")


@router.get("/{share_id}", response_model=ShareDetailResponse)
async def get_share(share_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Share).where(Share.id == share_id))
    share = result.scalar_one_or_none()
    if not share:
        raise HTTPException(status_code=404, detail="공유 링크를 찾을 수 없습니다.")

    # Increment view count
    await db.execute(
        update(Share).where(Share.id == share_id).values(view_count=Share.view_count + 1)
    )

    # Load session data
    sess_result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == share.session_id)
    )
    session = sess_result.scalar_one_or_none()
    await db.commit()

    if not session:
        raise HTTPException(status_code=404, detail="분석 데이터를 찾을 수 없습니다.")

    try:
        profile = json.loads(session.music_profile)
        explanation = json.loads(session.explanation)
    except Exception:
        raise HTTPException(status_code=500, detail="데이터 오류가 발생했습니다.")

    data = {
        "id": session.id,
        "input": session.input_text,
        "musicProfile": profile,
        "explanation": explanation,
        "imageUrl": session.image_url,
        "isMock": session.is_mock,
    }
    return ShareDetailResponse(
        success=True,
        data=data,
        view_count=share.view_count,
        created_at=share.created_at.isoformat() if share.created_at else "",
    )


@router.delete("/{share_id}")
async def delete_share(
    share_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    result = await db.execute(select(Share).where(Share.id == share_id))
    share = result.scalar_one_or_none()
    if not share:
        raise HTTPException(status_code=404, detail="공유 링크를 찾을 수 없습니다.")
    await db.delete(share)
    await db.commit()
    return {"success": True}
