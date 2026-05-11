# MDE — 시스템 아키텍처

## 전체 구조

```
┌─────────────────────────────────────────────┐
│         Next.js 15 Frontend (Vercel)         │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Pages  │  │Components│  │  lib/     │  │
│  │ /analyze│  │MusicIdea │  │history.ts │  │
│  │ /result │  │Input.tsx │  │auth-utils │  │
│  │ /history│  │MusicProf │  │hooks/     │  │
│  └────┬────┘  └──────────┘  └───────────┘  │
│       │ Next.js API Routes (/api/*)          │
└───────┼─────────────────────────────────────┘
        │ HTTP (프록시, X-Forwarded-For 포함)
┌───────▼─────────────────────────────────────┐
│         FastAPI Backend (Railway)            │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ api/auth │  │api/analyz│  │api/share │  │
│  │ api/sess │  │api/admin │  │slowapi   │  │
│  └────┬─────┘  └─────┬────┘  └──────────┘  │
│       │              │                      │
│  ┌────▼──────────────▼────────────────────┐ │
│  │           services/                    │ │
│  │  gemini_service  direction_service     │ │
│  │  image_service                         │ │
│  └────┬────────────────────────────────── ┘ │
└───────┼─────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────┐
│         Google Gemini 2.0 Flash              │
│  - generateContent (텍스트)                  │
│  - generateContent (Vision, 이미지)          │
└─────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────┐
│         SQLite / PostgreSQL                  │
│  users / analysis_sessions / shares          │
└─────────────────────────────────────────────┘
```

---

## Next.js 프록시 패턴

프론트엔드 `/api/*` 라우트는 백엔드를 프록시한다. 이 패턴의 이유:

1. **쿠키 도메인 문제 해결**: 브라우저는 `localhost:3000`에서 `localhost:8000`의 쿠키를 받지 않는다. 프록시를 통해 `localhost:3000` 도메인으로 쿠키 설정 가능.
2. **CORS 없음**: 브라우저 → Next.js(동일 도메인) → FastAPI(서버사이드)
3. **IP 추출**: 프록시에서 `X-Forwarded-For` 헤더를 백엔드에 전달해 실제 클라이언트 IP 기반 rate limiting 가능

```typescript
// frontend/src/app/api/analyze/route.ts
const upstream = await fetch(`${BACKEND_URL}/analyze`, {
  headers: {
    'X-Forwarded-For': clientIp,
    Cookie: `mde_session=${cookie}`,
  },
})
```

---

## 백엔드 레이어 구조

| 레이어 | 위치 | 역할 |
|--------|------|------|
| API 라우터 | `app/api/` | HTTP 요청/응답, 유효성 검사, 에러 처리 |
| 서비스 | `app/services/` | 비즈니스 로직, LLM 호출 |
| 모델 | `app/models/` | SQLAlchemy ORM 정의 |
| 스키마 | `app/schemas/` | Pydantic 요청/응답 모델 |
| 코어 | `app/core/` | 설정, DB, 보안, 의존성 |

---

## 인증 흐름

```
1. 사용자 로그인 → POST /api/auth/login
2. Next.js 프록시 → FastAPI
3. FastAPI: JWT 생성 + Set-Cookie: mde_session=<jwt>
4. Next.js: Set-Cookie 헤더 그대로 브라우저에 전달
5. 브라우저: localhost:3000 도메인에 쿠키 저장
6. 이후 요청: 브라우저 쿠키 → Next.js 프록시 → FastAPI 검증
```

---

## 이미지 분석 흐름

```
1. 사용자: 이미지 파일 선택 (드래그 앤 드롭 or 파일 버튼)
2. 프론트엔드: FileReader로 base64 변환
3. POST /api/analyze/image { mime_type, data: base64 }
4. FastAPI: Gemini Vision API 호출
5. Gemini: 이미지 → 한국어 감성 묘사 텍스트
6. FastAPI: 텍스트로 MusicProfile 생성 (일반 분석과 동일)
7. 응답: { ...결과, imageDescription: "비가 오는 날..." }
8. 프론트엔드: textarea에 imageDescription 자동 입력
```
