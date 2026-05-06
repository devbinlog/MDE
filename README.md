# MDE — Music Direction Engine

**AI 기반 멀티모달 음악 방향성 구조화 시스템**

텍스트 또는 이미지 입력을 받아, 음악의 감정·분위기·템포·장르 등 속성을 구조화된 MusicProfile로 변환하고 음악·비주얼·콘텐츠 방향성을 도출하는 AI 서비스

---

## 스크린샷

### 홈

<!-- 홈 페이지 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![홈](docs/screenshots/home.png) -->

---

### 분석 입력

<!-- 분석 입력 페이지 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![분석 입력](docs/screenshots/analyze.png) -->

---

### 분석 결과

<!-- 분석 결과 페이지 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![분석 결과](docs/screenshots/result.png) -->

---

### 히스토리

<!-- 히스토리 페이지 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![히스토리](docs/screenshots/history.png) -->

---

### 공유

<!-- 공유 결과 페이지 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![공유](docs/screenshots/shared.png) -->

---

### 관리자

<!-- 관리자 대시보드 캡처 이미지를 여기에 추가해주세요 -->
<!-- ![관리자](docs/screenshots/admin.png) -->

---

## 프로젝트 개요

MDE(Music Direction Engine)는 음악 크리에이터가 "만들고 싶은 음악의 느낌"을 자연어 또는 이미지로 입력하면, AI가 이를 **MusicProfile**이라는 구조화된 데이터로 변환하고 음악 제작 방향성을 제시하는 서비스다.

> "새벽 3시, 비 오는 날, 혼자 운전하는 느낌"
> → MusicProfile + 음악 방향 + 비주얼 방향 + 콘텐츠 방향

음악을 **직접 추천하는 것이 아니라**, 어떤 음악이 만들어져야 하는지의 **방향성을 구조화**하는 것이 핵심이다.

---

## 문제 정의

| 문제 | 설명 |
|------|------|
| 방향성 부재 | 감정은 있지만 음악 언어로 변환하지 못함 |
| 협업 단절 | 아티스트-프로듀서 간 언어 불일치 |
| 레퍼런스 과부하 | 레퍼런스는 많지만 정작 방향이 없음 |

---

## 솔루션

자연어/이미지 입력 → Gemini AI → 9개 필드 MusicProfile → 4가지 방향성 설명

```
사용자 입력 (텍스트 or 이미지)
  → [이미지인 경우] Gemini Vision → 텍스트 변환
  → MusicProfile 생성 (temperature=0.3, JSON 스키마 강제)
  → 방향성 설명 생성 (음악/사운드/비주얼/콘텐츠)
  → 결과 저장 + 공유 링크 발급
```

---

## 시스템 아키텍처

```
┌─────────────────────────────────────┐
│      Next.js 15 Frontend (Vercel)   │
│  - 텍스트/이미지 입력 UI             │
│  - 결과 시각화, 히스토리, 공유       │
└──────────────┬──────────────────────┘
               │ REST API (프록시)
┌──────────────▼──────────────────────┐
│      FastAPI Backend (Railway)      │
│  - JWT 인증 (쿠키 기반)              │
│  - 분석, 세션, 공유 API              │
│  - slowapi 율 제한 (IP별)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Gemini 2.0 Flash (Google AI)      │
│  - 텍스트 → MusicProfile JSON       │
│  - 이미지 → 텍스트 변환 (Vision)    │
└─────────────────────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   SQLite (개발) / PostgreSQL (운영)  │
│  - 사용자, 세션, 공유 링크           │
└─────────────────────────────────────┘
```

---

## MusicProfile 스키마 (9개 필드)

```json
{
  "emotion": ["melancholic", "nostalgic"],
  "energy": "low",
  "tempo_feel": "slow",
  "genre": ["indie pop", "dream pop"],
  "instrumentation": ["acoustic guitar", "piano", "light drums"],
  "sound_direction": ["heavy reverb", "warm compression"],
  "atmosphere": ["rainy night", "foggy morning"],
  "visual_association": ["neon reflections", "empty roads"],
  "listener_context": "새벽 드라이브",
  "content_goal": "album_cover",
  "summary": "비 내리는 새벽, 혼자 달리는 감성의 몽환적 인디팝"
}
```

---

## 방향성 출력 (4개 필드)

| 필드 | 설명 |
|------|------|
| `music_direction` | 전반적인 음악 느낌, 구조, 감정 흐름 |
| `sound_direction` | 리버브, 믹스 폭, 악기 레이어 등 프로덕션 선택 |
| `visual_direction` | 앨범 커버 콘셉트, 색상 팔레트, 아트워크 방향 |
| `content_usage` | 콘텐츠 활용 맥락, SNS 전략 |

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.11, SQLAlchemy async, aiosqlite |
| AI | Gemini 2.0 Flash (텍스트 + Vision 멀티모달) |
| Auth | JWT (python-jose, HS256), HTTP-only 쿠키 |
| Rate Limit | slowapi (IP별 분당 200회 / 이미지 10회) |
| Database | SQLite (개발), PostgreSQL 전환 가능 |
| 배포 | Vercel (FE), Railway (BE) |
| Image | Pollinations.ai (앨범 커버 생성) |

---

## 로컬 실행

```bash
# 1. 클론
git clone https://github.com/devbinlog/MDE.git
cd MDE

# 2. 프론트엔드 의존성
cd frontend && pnpm install

# 3. 백엔드 의존성
cd ../backend
pip install -r requirements.txt

# 4. 환경 변수 설정
# backend/.env 에 LLM_API_KEY=<Gemini API Key> 입력

# 5. 백엔드 실행
python3 -m uvicorn app.main:app --port 8000 --host 127.0.0.1

# 6. 프론트엔드 실행 (새 터미널)
cd frontend && pnpm dev
```

프론트엔드: http://localhost:3000
백엔드 Swagger: http://localhost:8000/docs

---

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/analyze` | 텍스트 분석 → MusicProfile |
| POST | `/api/analyze/image` | 이미지 분석 → Vision → MusicProfile |
| GET | `/api/sessions` | 내 분석 히스토리 |
| GET | `/api/sessions/{id}` | 특정 세션 조회 |
| DELETE | `/api/sessions/{id}` | 세션 삭제 |
| POST | `/api/share` | 공유 링크 생성 |
| GET | `/api/share/{id}` | 공유 결과 조회 |
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |
| GET | `/api/admin/stats` | 관리자 통계 |
| GET | `/api/health` | 서버 상태 확인 |

---

## 프로젝트 구조

```
MDE/
├── frontend/                   # Next.js 15 프론트엔드
│   └── src/
│       ├── app/                # 페이지 라우트
│       │   ├── page.tsx        # 홈
│       │   ├── analyze/        # 분석 입력
│       │   ├── result/[id]/    # 분석 결과
│       │   ├── history/        # 히스토리
│       │   ├── shared/[id]/    # 공유 결과
│       │   ├── admin/          # 관리자
│       │   ├── login/          # 로그인
│       │   └── signup/         # 회원가입
│       ├── components/         # UI 컴포넌트
│       └── lib/                # 유틸리티, hooks, 서비스
├── backend/                    # FastAPI 백엔드
│   └── app/
│       ├── api/                # 라우터 (auth, analyze, sessions, share, admin)
│       ├── core/               # config, database, security, deps
│       ├── models/             # ORM 모델 (User, AnalysisSession, Share)
│       ├── schemas/            # Pydantic 스키마
│       └── services/           # gemini_service, direction_service, image_service
├── docs/                       # 시스템 문서
│   └── screenshots/            # 페이지 스크린샷 (캡처 후 추가)
└── README.md
```

---

## 스크린샷 추가 방법

`docs/screenshots/` 폴더에 각 페이지 캡처 이미지를 저장하면 위 스크린샷 섹션에 자동으로 표시됩니다.

| 파일명 | 페이지 |
|--------|--------|
| `home.png` | 홈 |
| `analyze.png` | 분석 입력 |
| `result.png` | 분석 결과 |
| `history.png` | 히스토리 |
| `shared.png` | 공유 결과 |
| `admin.png` | 관리자 대시보드 |

---

## 라이센스

MIT License

---

*MDE — Music Direction Engine | Built with Gemini 2.0 Flash + FastAPI + Next.js 15*
