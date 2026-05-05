from pydantic import BaseModel
from typing import Any, Optional


class AnalyzeOptions(BaseModel):
    emotion: Optional[list[str]] = None
    genre: Optional[list[str]] = None
    content_goal: Optional[str] = None


class AnalyzeRequest(BaseModel):
    input: str
    options: Optional[AnalyzeOptions] = None


class AnalysisResultResponse(BaseModel):
    success: bool
    data: Optional[dict[str, Any]] = None
    error: Optional[str] = None
    code: Optional[str] = None


class SessionListItem(BaseModel):
    id: str
    input_text: str
    summary: str
    created_at: str
    is_mock: bool


class SessionDetail(BaseModel):
    id: str
    input_text: str
    music_profile: dict[str, Any]
    explanation: dict[str, Any]
    image_url: Optional[str]
    is_mock: bool
    created_at: str


class ShareCreateRequest(BaseModel):
    session_id: Optional[str] = None
    # 세션 ID 없이 직접 데이터를 전달하는 경우도 지원
    music_profile: Optional[dict[str, Any]] = None
    explanation: Optional[dict[str, Any]] = None
    input: Optional[str] = None


class ShareResponse(BaseModel):
    success: bool
    id: str
    url: str


class ShareDetailResponse(BaseModel):
    success: bool
    data: dict[str, Any]
    view_count: int
    created_at: str
