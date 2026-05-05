# MDE — 데이터 모델

## DB 스키마

### users

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | STRING(32) PK | secrets.token_hex(16) |
| `email` | STRING(255) UNIQUE | 이메일 |
| `password_hash` | STRING(255) | bcrypt 해시 |
| `role` | STRING(20) | user / admin |
| `created_at` | DATETIME | 생성 시각 |

특이사항: 관리자 계정은 `id='admin'`으로 고정. 이메일 변경 시 UPDATE.

### analysis_sessions

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | STRING(64) PK | `analysis_{timestamp}_{rand}` |
| `user_id` | STRING(32) FK | NULL = 비로그인 사용자 |
| `input_text` | TEXT | 원본 입력 (이미지인 경우 Vision 결과) |
| `music_profile` | TEXT | MusicProfile JSON 문자열 |
| `explanation` | TEXT | 방향성 설명 JSON 문자열 |
| `image_url` | TEXT | Pollinations.ai 앨범 커버 URL |
| `is_mock` | BOOLEAN | 목 데이터 여부 (현재 항상 False) |
| `created_at` | DATETIME | 생성 시각 (인덱스) |

### shares

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | STRING(32) PK | `s_{timestamp}_{rand}` |
| `session_id` | STRING(64) FK | 분석 세션 참조 |
| `view_count` | INTEGER | 조회 수 |
| `created_at` | DATETIME | 생성 시각 |

---

## ORM 모델 (SQLAlchemy)

```python
class User(Base):
    __tablename__ = "users"
    id            = Column(String(32), primary_key=True)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(String(20), default="user")
    created_at    = Column(DateTime, server_default=func.now())

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"
    id            = Column(String(64), primary_key=True)
    user_id       = Column(String(32), ForeignKey("users.id"), nullable=True)
    input_text    = Column(Text, nullable=False)
    music_profile = Column(Text, nullable=False)   # JSON string
    explanation   = Column(Text, nullable=False)   # JSON string
    image_url     = Column(Text, nullable=True)
    is_mock       = Column(Boolean, default=False)
    created_at    = Column(DateTime, server_default=func.now(), index=True)

class Share(Base):
    __tablename__ = "shares"
    id            = Column(String(32), primary_key=True)
    session_id    = Column(String(64), ForeignKey("analysis_sessions.id"))
    view_count    = Column(Integer, default=0)
    created_at    = Column(DateTime, server_default=func.now())
```

---

## MusicProfile JSON 스키마

```json
{
  "emotion": ["melancholic", "nostalgic"],
  "energy": "low",
  "tempo_feel": "slow",
  "genre": ["indie pop", "dream pop"],
  "instrumentation": ["acoustic guitar", "piano", "light drums", "strings"],
  "sound_direction": ["heavy reverb", "warm compression", "wide stereo pad"],
  "atmosphere": ["rainy night", "foggy morning", "intimate room"],
  "visual_association": ["neon reflections", "empty roads", "foggy window"],
  "listener_context": "새벽 드라이브",
  "content_goal": "album_cover",
  "summary": "비 내리는 새벽, 혼자 달리는 감성의 몽환적 인디팝"
}
```

### content_goal 열거형

| 값 | 설명 |
|----|------|
| `album_cover` | 앨범 커버 제작 |
| `live_performance` | 라이브 공연 |
| `demo_planning` | 데모 기획 |
| `playlist_mood` | 플레이리스트 무드 |
| `concept_planning` | 컨셉 기획 |

---

## 방향성 설명 JSON 스키마

```json
{
  "music_direction": "헤비 리버브가 적용된 피아노와 어쿠스틱 기타의 레이어링으로 시작해...",
  "sound_direction": "드라이한 보컬 위에 넓은 스테레오 신스 패드를 깔아...",
  "visual_direction": "흐린 네온 반사가 빗물에 번지는 야경 컨셉. 색상 팔레트는...",
  "content_usage": "새벽 드라이브나 감성적인 야간 콘텐츠에 최적화. 인스타그램 릴스..."
}
```

---

## 세션 ID 생성 규칙

```python
def _generate_session_id() -> str:
    ts = int(time.time() * 1000)   # Unix timestamp (ms)
    rand = secrets.token_hex(4)     # 8자 랜덤 hex
    return f"analysis_{ts}_{rand}"  # e.g. analysis_1746441600000_a3f2b1c9
```
