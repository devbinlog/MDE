# Backend Agent

## 역할

FastAPI 백엔드 설계, 구현, API 명세 정의.

## 담당 영역

- FastAPI 앱 구조 설계 (`app/api`, `app/core`, `app/models`, `app/schemas`, `app/services`)
- 인증 시스템 (JWT, bcrypt, 쿠키)
- 분석 엔드포인트 (`/analyze`, `/analyze/image`)
- 세션/공유/관리자 API
- Rate Limiting (slowapi, X-Forwarded-For 기반 IP 추출)
- DB 모델 (SQLAlchemy async, SQLite/PostgreSQL)

## 기술 스택

- FastAPI 0.115.5
- SQLAlchemy 2.0 (async)
- aiosqlite
- python-jose (JWT)
- passlib + bcrypt==4.2.1
- slowapi
- httpx (Gemini API 호출)
- pydantic-settings

## 핵심 구현 사항

### bcrypt 버전 호환성
passlib 1.7.4는 bcrypt 5.x와 호환되지 않음.
`bcrypt==4.2.1` 고정으로 해결.

### 쿠키 이름 통일
`mde_session`으로 통일 (기존 `fmd_session`에서 변경).
`deps.py`의 `COOKIE_NAME` 상수로 중앙화.

### 관리자 계정 관리
`id='admin'`으로 고정. 이메일 변경 시 UPDATE 처리.
UNIQUE 제약 충돌 방지를 위해 id 기준 조회 → 없으면 이메일 기준 조회.

### IP 기반 Rate Limiting
```python
def _get_real_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host
```
