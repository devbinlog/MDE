# MDE — 배포 가이드

## 로컬 개발 환경

### 사전 요구사항

- Python 3.11+
- Node.js 18+ / pnpm
- Gemini API 키 (Google AI Studio 무료)

### 설치 및 실행

```bash
# 1. 클론
git clone https://github.com/devbinlog/MDE.git
cd MDE

# 2. 백엔드 설정
cd backend
pip install -r requirements.txt

cp .env.example .env
# .env 에서 LLM_API_KEY 설정

# 3. 백엔드 실행
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 4. 프론트엔드 설정 (새 터미널)
cd frontend
pnpm install

cp .env.local.example .env.local
# .env.local 에서 BACKEND_URL, JWT_SECRET 설정

# 5. 프론트엔드 실행
pnpm dev
```

접속:
- 프론트엔드: http://localhost:3000
- 백엔드 Swagger: http://localhost:8000/docs

---

## 환경 변수

### backend/.env

| 변수 | 설명 | 예시 |
|------|------|------|
| `DATABASE_URL` | DB 연결 문자열 | `sqlite+aiosqlite:///./mde.db` |
| `JWT_SECRET` | JWT 서명 키 (32자 이상 권장) | `your_secret_here` |
| `JWT_ALGORITHM` | JWT 알고리즘 | `HS256` |
| `JWT_EXPIRE_DAYS` | 토큰 만료 기간 (일) | `7` |
| `ADMIN_EMAIL` | 관리자 이메일 | `admin@mde.dev` |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | `your_admin_password` |
| `LLM_PROVIDER` | LLM 제공자 | `gemini` |
| `LLM_MODEL` | 모델 ID | `gemini-2.0-flash` |
| `LLM_API_KEY` | Gemini API 키 | `AIzaSy...` |
| `FRONTEND_URL` | CORS 허용 도메인 | `http://localhost:3000` |

### frontend/.env.local

| 변수 | 설명 | 예시 |
|------|------|------|
| `BACKEND_URL` | 백엔드 API URL | `http://localhost:8000/api` |
| `JWT_SECRET` | 백엔드와 동일한 JWT 키 | `your_secret_here` |
| `ADMIN_EMAIL` | 관리자 이메일 | `admin@mde.dev` |

---

## 프로덕션 배포

### 백엔드 → Railway

1. Railway 계정 생성
2. GitHub 저장소 연결
3. Root Directory: `backend`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 설정:
   - `DATABASE_URL`: PostgreSQL URL (Railway에서 제공)
   - `JWT_SECRET`, `LLM_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `FRONTEND_URL`: Vercel 배포 URL

### 프론트엔드 → Vercel

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. Root Directory: `frontend`
4. 환경 변수 설정:
   - `BACKEND_URL`: Railway 백엔드 URL
   - `JWT_SECRET`: 백엔드와 동일

### PostgreSQL 전환

`DATABASE_URL`만 변경하면 됨:

```bash
# SQLite (개발)
DATABASE_URL=sqlite+aiosqlite:///./mde.db

# PostgreSQL (운영)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/mde
```

`asyncpg` 추가 설치 필요:
```bash
pip install asyncpg
```

---

## 백엔드 프로세스 관리

```bash
# 실행 중인 서버 확인
lsof -ti:8000

# 서버 종료
lsof -ti:8000 | xargs kill -9

# 백그라운드 실행 (로컬)
python3 -m uvicorn app.main:app --port 8000 --host 127.0.0.1 > /tmp/mde.log 2>&1 &

# 로그 확인
tail -f /tmp/mde.log
```

---

## Gemini API 키 발급

1. https://aistudio.google.com 접속
2. "Get API Key" → "Create API key"
3. 무료 한도: 15 RPM / 1,500 RPD (2026 기준)
4. 한도 초과 시 사용자에게 "오늘의 무료 AI 분석 한도를 초과했습니다" 메시지 표시
