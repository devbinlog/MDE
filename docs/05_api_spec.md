# MDE — API 명세

Base URL: `http://localhost:8000/api` (개발) / `https://api.mde.dev/api` (운영)

---

## 인증

JWT 쿠키 (`mde_session`) 기반. HTTP-only, SameSite=Lax.

로그인 후 쿠키가 자동으로 포함됨. 명시적 Authorization 헤더 불필요.

---

## 분석

### POST `/analyze`

텍스트 입력으로 MusicProfile + 방향성 생성.

**Rate limit:** 200회/분 (IP별)

**Request**
```json
{
  "input": "비가 오는 늦가을 오후, 카페 창가에서 느끼는 잔잔한 감성",
  "options": {
    "emotion": ["melancholic"],
    "genre": ["indie pop"],
    "content_goal": "album_cover"
  }
}
```

`options`는 선택사항. 입력에 힌트를 추가해 방향성을 유도함.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "analysis_1746441600000_a3f2b1c9",
    "input": "비가 오는 늦가을 오후...",
    "musicProfile": { ... },
    "explanation": { ... },
    "imageUrl": "https://image.pollinations.ai/prompt/...",
    "createdAt": "2026-05-05T10:00:00+00:00",
    "isMock": false
  }
}
```

**Error 400** - 입력 너무 짧음/긺
**Error 429** - Gemini quota 초과
**Error 502** - Gemini 서비스 오류

---

### POST `/analyze/image`

이미지 입력으로 MusicProfile + 방향성 생성.

**Rate limit:** 10회/분 (IP별)

**Request**
```json
{
  "mime_type": "image/jpeg",
  "data": "<base64 encoded image>"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "analysis_1746441600000_b4c2d1e8",
    "input": "비가 내리는 창가, 흐린 하늘과 빗방울이...",
    "imageDescription": "비가 내리는 창가, 흐린 하늘과 빗방울이 유리창을 타고 흐르는 모습. 차분하고 사색적인 분위기.",
    "musicProfile": { ... },
    "explanation": { ... },
    "imageUrl": "https://image.pollinations.ai/prompt/...",
    "createdAt": "2026-05-05T10:00:00+00:00",
    "isMock": false
  }
}
```

---

## 세션

### GET `/sessions`

내 분석 히스토리 목록. **인증 필요.**

**Query params:** `q` (텍스트 검색), `limit` (기본 20)

**Response 200**
```json
{
  "sessions": [
    {
      "id": "analysis_...",
      "input_text": "비가 오는 늦가을...",
      "summary": "비 내리는 새벽의 몽환적 인디팝",
      "created_at": "2026-05-05T10:00:00"
    }
  ]
}
```

### GET `/sessions/{id}`

특정 세션 상세 조회.

### DELETE `/sessions/{id}`

내 세션 삭제. **인증 필요.**

---

## 공유

### POST `/share`

공유 링크 생성.

**Request**
```json
{ "session_id": "analysis_1746441600000_a3f2b1c9" }
```

**Response 201**
```json
{ "share_id": "s_1746441600000_f5e4d3c2" }
```

### GET `/share/{id}`

공유 결과 조회. 인증 불필요. view_count 증가.

**Response 200**
```json
{
  "session": { ... },
  "share": {
    "id": "s_...",
    "view_count": 12,
    "created_at": "2026-05-05T10:00:00"
  }
}
```

---

## 인증

### POST `/auth/register`
```json
{ "email": "user@example.com", "password": "password123" }
```
Response: `{ "success": true, "role": "user" }` + Set-Cookie

### POST `/auth/login`
```json
{ "email": "user@example.com", "password": "password123" }
```
Response: `{ "success": true, "role": "user" }` + Set-Cookie

### POST `/auth/logout`
Response: `{ "success": true }` + Cookie 삭제

### GET `/auth/me`
Response: `{ "user": { "id": "...", "email": "...", "role": "user" } }`

---

## 관리자

### GET `/admin/stats`
**관리자 인증 필요.**

```json
{
  "stats": {
    "totalUsers": 42,
    "totalSessions": 1024,
    "totalShares": 156,
    "totalViews": 3891
  },
  "recentShares": [ ... ]
}
```

---

## 헬스체크

### GET `/health`
```json
{
  "status": "ok",
  "llm_provider": "gemini",
  "llm_model": "gemini-2.0-flash",
  "demo_mode": false
}
```
