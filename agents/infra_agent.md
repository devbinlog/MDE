# Infra Agent

## 역할

인프라, 배포, 환경 설정, 보안 구성.

## 담당 영역

- 로컬 개발 환경 구성
- 환경 변수 관리 (`.env`, `.env.local`)
- Git 저장소 설정 (`.gitignore`, GitHub 연동)
- 백엔드 프로세스 관리 (uvicorn)
- DB 파일 관리 (SQLite, iCloud 격리 이슈 해결)
- Vercel / Railway 배포 준비

## 환경 이슈 및 해결

### iCloud 파일 접근 불가
MacOS iCloud Drive에 저장된 파일은 오프라인 상태에서 타임아웃 발생.
해결: `rm` 삭제 후 재생성. `.gitignore`에 `*.icloud` 추가.

### bcrypt 버전 호환성
`bcrypt 5.x`는 `passlib 1.7.4`와 호환되지 않음.
해결: `requirements.txt`에 `bcrypt==4.2.1` 고정.

### 포트 충돌
`pkill uvicorn` 후에도 포트 점유 시:
```bash
lsof -ti:8000 | xargs kill -9
```

## 보안 설정

- `.env`, `.env.local`, `*.db` → `.gitignore` 처리
- `.env.example` 파일로 설정 방법 문서화
- `secure=False` (개발) → `True` (HTTPS 프로덕션) 변경 필요
