from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(32), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    created_at = Column(DateTime, server_default=func.now())


class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(String(64), primary_key=True)  # "analysis_<ts>_<rand>"
    user_id = Column(String(32), ForeignKey("users.id"), nullable=True)  # NULL = 비로그인
    input_text = Column(Text, nullable=False)
    music_profile = Column(Text, nullable=False)   # JSON string
    explanation = Column(Text, nullable=False)     # JSON string
    image_url = Column(Text, nullable=True)
    is_mock = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now(), index=True)


class Share(Base):
    __tablename__ = "shares"

    id = Column(String(32), primary_key=True)  # "s_<ts>_<rand>"
    session_id = Column(String(64), ForeignKey("analysis_sessions.id"), nullable=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
