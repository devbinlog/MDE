# MDE — 운영 전략

## 현재 운영 상태 (v1.0)

| 항목 | 현재 값 | 비고 |
|------|---------|------|
| LLM | Gemini 2.0 Flash (무료) | 1,500 RPD 한도 |
| DB | SQLite | 단일 파일, 동시성 제한 |
| 인증 | JWT (7일) | HTTP-only 쿠키 |
| 이미지 | Pollinations.ai | 무료, 로고 제거 파라미터 |
| 배포 | 로컬 개발 | Vercel/Railway 전환 준비 완료 |

---

## Rate Limiting 전략

```python
# analyze.py
limiter = Limiter(key_func=_get_real_ip)  # IP별 제한

@limiter.limit("200/minute")   # 텍스트 분석
async def analyze(...): ...

@limiter.limit("10/minute")    # 이미지 분석 (Vision API 비용 고려)
async def analyze_image(...): ...
```

Next.js 프록시에서 `X-Forwarded-For` 헤더를 전달하므로 모든 요청이 동일 IP로 집계되는 문제 없음.

---

## 확장 로드맵

### v1.5 (단기)
- 대화형 정제: "더 어둡게", "템포를 빠르게" 등의 수정 요청
- 결과 비교: 이전 분석과 나란히 비교 보기
- 태그 기반 히스토리 필터

### v2.0 (중기)
- Suno / AudioCraft API 연동 → 실제 음악 생성
- MusicProfile → MIDI 파라미터 변환
- 생성된 음악 미리듣기

### v2.5 (장기)
- 팀 협업: 아티스트-프로듀서 공유 워크스페이스
- B2B 레이블: 다수 아티스트 관리
- 유료 구독: 고급 모델 선택, 히스토리 무제한

---

## 비용 구조

| 항목 | 현재 | 프로덕션 예상 |
|------|------|------------|
| LLM | 무료 (Gemini 무료 티어) | 유료 전환 시 ~$0.075/1M 토큰 |
| DB | 무료 (SQLite 로컬) | PostgreSQL ~$5/월 (Railway) |
| 백엔드 호스팅 | 무료 (로컬) | ~$5/월 (Railway) |
| 프론트엔드 호스팅 | 무료 (로컬) | 무료 (Vercel) |
| 이미지 생성 | 무료 (Pollinations.ai) | 동일 |

---

## 모니터링 포인트

1. **Gemini quota 사용량**: 일일 1,500 RPD 중 소비율
2. **분석 실패율**: GeminiRateLimitError, GeminiServiceError 발생 빈도
3. **응답 시간**: 평균 분석 완료 시간 (목표 10초 이내)
4. **세션 저장 실패**: DB 장애 시 분석은 성공하지만 히스토리 미저장

---

## 보안 체크리스트

- [x] 비밀번호 bcrypt 해시 저장
- [x] JWT HTTP-only 쿠키 (XSS 방어)
- [x] .env 파일 .gitignore 처리 (API 키 노출 방지)
- [x] 입력 길이 제한 (500자)
- [x] 이미지 크기 제한 (10MB)
- [x] MIME 타입 화이트리스트
- [x] IP별 Rate Limiting
- [ ] HTTPS 적용 (프로덕션 필수)
- [ ] auth.py의 `secure=False` → `True` 변경 (HTTPS 배포 시)
