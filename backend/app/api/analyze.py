import json
import logging
import secrets
import time
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from slowapi import Limiter
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_optional_user
from app.models.orm import User, AnalysisSession
from app.schemas.analysis import AnalyzeRequest, AnalysisResultResponse
from app.services.direction_service import generate_all_directions
from app.services.openrouter_service import (
    GeminiRateLimitError, GeminiServiceError, describe_image
)
from app.services.image_service import get_image_url

logger = logging.getLogger(__name__)
router = APIRouter(tags=["analyze"])

MAX_INPUT_LEN = 500
MIN_INPUT_LEN = 10
MAX_IMAGE_SIZE_MB = 10


def _get_real_ip(request: Request) -> str:
    """Extract real client IP, checking X-Forwarded-For from Next.js proxy."""
    forwarded = request.headers.get("X-Forwarded-For") or \
                request.headers.get("X-Real-IP")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# Rate limiter using real client IP
limiter = Limiter(key_func=_get_real_ip)


def _generate_session_id() -> str:
    ts = int(time.time() * 1000)
    rand = secrets.token_hex(4)
    return f"analysis_{ts}_{rand}"


async def _save_session(
    db: AsyncSession,
    session_id: str,
    text: str,
    music_profile: dict,
    explanation: dict,
    image_url: Optional[str],
    user_id: Optional[str],
) -> None:
    session = AnalysisSession(
        id=session_id,
        user_id=user_id,
        input_text=text,
        music_profile=json.dumps(music_profile, ensure_ascii=False),
        explanation=json.dumps(explanation, ensure_ascii=False),
        image_url=image_url,
        is_mock=False,
    )
    db.add(session)
    await db.commit()


def _build_result(session_id: str, text: str, music_profile: dict, explanation: dict, image_url: Optional[str]) -> dict:
    return {
        "id": session_id,
        "input": text,
        "musicProfile": music_profile,
        "explanation": explanation,
        "imageUrl": image_url,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "isMock": False,
    }


@router.post("/analyze", response_model=AnalysisResultResponse)
@limiter.limit("200/minute")
async def analyze(
    request: Request,
    body: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    text = (body.input or "").strip()
    if len(text) < MIN_INPUT_LEN:
        raise HTTPException(status_code=400, detail=f"입력이 너무 짧습니다. 최소 {MIN_INPUT_LEN}자 이상 입력해주세요.")
    if len(text) > MAX_INPUT_LEN:
        raise HTTPException(status_code=400, detail=f"입력이 너무 깁니다. 최대 {MAX_INPUT_LEN}자까지 입력 가능합니다.")

    options = body.options.model_dump(exclude_none=True) if body.options else None

    try:
        directions = await generate_all_directions(text, options)
    except GeminiRateLimitError:
        raise HTTPException(
            status_code=429,
            detail="AI 모델이 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.",
        )
    except GeminiServiceError as e:
        logger.error("LLM service error: %s", e)
        raise HTTPException(status_code=502, detail="AI 서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    except Exception as e:
        logger.exception("Unexpected analyze error: %s", e)
        raise HTTPException(status_code=500, detail="분석 중 오류가 발생했습니다.")

    music_profile = directions["musicProfile"]
    explanation = directions["explanation"]
    image_url = get_image_url(music_profile)
    session_id = _generate_session_id()

    await _save_session(db, session_id, text, music_profile, explanation, image_url,
                        current_user.id if current_user else None)

    return AnalysisResultResponse(
        success=True,
        data=_build_result(session_id, text, music_profile, explanation, image_url),
    )


# ── Image Analysis ──────────────────────────────────────────────────────────

class ImageAnalyzeRequest(BaseModel):
    mime_type: str   # e.g. "image/jpeg"
    data: str        # base64-encoded image


@router.post("/analyze/image", response_model=AnalysisResultResponse)
@limiter.limit("10/minute")
async def analyze_image(
    request: Request,
    body: ImageAnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Accept a base64 image, describe it with Gemini Vision, then run music analysis."""
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if body.mime_type not in allowed_types:
        raise HTTPException(status_code=400, detail="지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF)")

    # Rough size check (base64 is ~4/3 of actual size)
    approx_mb = len(body.data) * 3 / 4 / 1024 / 1024
    if approx_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"이미지 크기가 너무 큽니다. 최대 {MAX_IMAGE_SIZE_MB}MB까지 허용됩니다.")

    try:
        # Step 1: Gemini Vision → text description
        description = await describe_image(body.mime_type, body.data)
    except GeminiRateLimitError:
        raise HTTPException(status_code=429, detail="AI 분석 한도를 초과했습니다. 잠시 후 다시 시도해주세요.")
    except GeminiServiceError as e:
        logger.error("Vision API error: %s", e)
        raise HTTPException(status_code=502, detail="이미지 분석에 실패했습니다. 잠시 후 다시 시도해주세요.")

    try:
        # Step 2: description → music directions
        directions = await generate_all_directions(description)
    except GeminiRateLimitError:
        raise HTTPException(status_code=429, detail="오늘의 무료 AI 분석 한도를 초과했습니다.")
    except (GeminiServiceError, Exception) as e:
        logger.exception("Direction error after image: %s", e)
        raise HTTPException(status_code=502, detail="음악 방향성 분석에 실패했습니다.")

    music_profile = directions["musicProfile"]
    explanation = directions["explanation"]
    image_url = get_image_url(music_profile)
    session_id = _generate_session_id()

    await _save_session(db, session_id, description, music_profile, explanation, image_url,
                        current_user.id if current_user else None)

    result = _build_result(session_id, description, music_profile, explanation, image_url)
    # Also return the image description so the frontend can show what was extracted
    result["imageDescription"] = description

    return AnalysisResultResponse(success=True, data=result)
