# MDE — 시스템 플로우

## 텍스트 분석 플로우

```
사용자
  │
  │ 텍스트 입력 (10~500자)
  ▼
MusicIdeaInput.tsx
  │
  │ POST /api/analyze (Next.js Route)
  ▼
frontend/src/app/api/analyze/route.ts
  │ X-Forwarded-For: 실제 IP
  │ Cookie: mde_session=<jwt>
  │
  │ POST http://localhost:8000/api/analyze
  ▼
FastAPI: POST /analyze
  │
  ├── 입력 검증 (10 ≤ len ≤ 500)
  ├── rate limit 확인 (slowapi, IP별 200/min)
  │
  │ call_gemini(PROFILE_SYSTEM_PROMPT, input_text, temperature=0.3)
  ▼
Gemini 2.0 Flash
  │ MusicProfile JSON 반환
  ▼
FastAPI
  │ extract_json() → MusicProfile dict
  │
  │ call_gemini(EXPLANATION_SYSTEM_PROMPT, profile_json, temperature=0.7)
  ▼
Gemini 2.0 Flash
  │ 방향성 설명 JSON 반환
  ▼
FastAPI
  │ get_image_url(music_profile) → Pollinations.ai URL
  │ _generate_session_id() → "analysis_{ts}_{rand}"
  │ _save_session(db, ...) → SQLite 저장
  │
  │ AnalysisResultResponse 반환
  ▼
Next.js Route
  │ JSON 그대로 전달
  ▼
useAnalyze.ts (React Hook)
  │
  ├── sessionStorage.setItem('mde_result', JSON.stringify(result))
  │
  ▼
analyze/page.tsx
  │ setStage('result')
  ▼
분석 결과 UI 표시
```

---

## 이미지 분석 플로우

```
사용자
  │
  │ 이미지 파일 선택 (드래그 앤 드롭 or 📷 버튼)
  ▼
MusicIdeaInput.tsx
  │ FileReader → base64 DataURL
  │
  │ POST /api/analyze/image
  ▼
FastAPI: POST /analyze/image
  │
  ├── MIME 타입 검증 (jpeg/png/webp/gif)
  ├── 크기 검증 (≤ 10MB)
  │
  │ describe_image(mime_type, base64_data)
  ▼
Gemini Vision API
  │ "비가 내리는 창가, 흐린 하늘과..." (한국어 감성 묘사)
  ▼
FastAPI
  │ 텍스트로 generate_all_directions() 호출 (일반 분석과 동일)
  │ result["imageDescription"] = description 추가
  │
  ▼
프론트엔드
  │ imageDescription을 textarea에 자동 입력
  │ onImageAnalyze(payload) 콜백으로 결과 전달
  ▼
분석 결과 UI 표시
```

---

## 인증 플로우

```
로그인 시:
사용자 → POST /api/auth/login → Next.js 프록시 → FastAPI
FastAPI: JWT 생성 → Set-Cookie: mde_session=<jwt>; HttpOnly; SameSite=Lax
Next.js: Set-Cookie 헤더 그대로 응답에 포함
브라우저: localhost:3000 도메인에 mde_session 쿠키 저장

이후 API 요청 시:
브라우저 → Next.js 프록시 (쿠키 자동 포함) → FastAPI
FastAPI: Cookie에서 mde_session 추출 → JWT 검증 → 사용자 확인
```

---

## 공유 플로우

```
결과 페이지에서 공유 버튼 클릭
  │
  │ POST /api/share { session_id }
  ▼
FastAPI: shares 테이블에 Insert
  │ share_id = "s_{ts}_{rand}"
  ▼
프론트엔드: /shared/{share_id} URL 복사

공유 링크 접근 시:
  │ GET /api/share/{share_id}
  ▼
FastAPI: shares.view_count++ → session + share 정보 반환
  ▼
shared/[id]/page.tsx: 결과 표시 (읽기 전용)
```
