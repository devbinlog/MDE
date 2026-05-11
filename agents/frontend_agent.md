# Frontend Agent

## 역할

Next.js 15 기반 프론트엔드 개발 및 사용자 경험 구현.

## 담당 영역

- 페이지 구조 설계 및 구현 (`/analyze`, `/result`, `/history`, `/shared`, `/admin`)
- 컴포넌트 설계 (`MusicIdeaInput`, `MusicProfileCard`, `MusicDirectionSummary`)
- 백엔드 API 프록시 라우트 구현 (`/api/*`)
- 인증 상태 관리 (쿠키 기반 JWT)
- 이미지 업로드 UI (드래그 앤 드롭, 파일 버튼, base64 변환)
- sessionStorage 기반 결과 캐싱

## 기술 스택

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4

## 핵심 구현 사항

### Next.js 프록시 패턴
백엔드 직접 호출 대신 Next.js API 라우트를 통해 프록시.
쿠키 도메인 문제 해결 + CORS 없음 + X-Forwarded-For 전달.

### 이미지 업로드
`MusicIdeaInput.tsx`에서 FileReader API로 base64 변환 후
`/api/analyze/image`로 전송. 결과의 `imageDescription`을 textarea에 자동 입력.

### 상태 관리
분석 결과는 `sessionStorage('mde_result')`에 저장.
히스토리는 로그인 시 백엔드, 비로그인 시 `localStorage('mde_history')` 사용.
