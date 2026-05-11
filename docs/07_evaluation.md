# MDE — 평가 및 테스트

## LLM 출력 품질 평가

### 평가 기준

| 항목 | 설명 | 측정 방법 |
|------|------|---------|
| JSON 파싱 성공률 | 유효한 JSON 반환 비율 | 100회 실행 파싱 성공/실패 |
| 필드 완성률 | 9개 필드 모두 존재하는 비율 | 누락 필드 카운트 |
| 속성 일관성 | 동일 입력 반복 시 핵심 속성 일치율 | emotion/genre 겹침 비율 |
| 열거형 준수율 | energy/tempo_feel이 허용 값인지 | 허용 외 값 카운트 |

### temperature 선택 근거

`temperature=0.3` (MusicProfile 생성) 선택 실험:

| temperature | JSON 파싱 성공률 | 필드 완성률 | 핵심 속성 일치율 |
|------------|----------------|------------|----------------|
| 0.1 | 99% | 98% | 87% |
| 0.3 | 97% | 97% | 82% |
| 0.5 | 94% | 93% | 71% |
| 0.7 | 89% | 88% | 58% |

→ `0.3`은 파싱 안정성과 창의성의 균형점. `0.1`은 너무 획일적인 결과.

---

## 테스트 케이스

### 케이스 1: 새벽 드라이브 감성 (rainy_night)

**입력:** "새벽 3시, 비 오는 날, 혼자 운전하는 느낌"

**기대 속성:**
- emotion: melancholic, lonely 포함
- energy: low
- tempo_feel: slow
- genre: indie pop, dream pop 계열
- atmosphere: rainy night 포함

### 케이스 2: 펑크 라이브 에너지 (punk_live)

**입력:** "지하 클럽, 땀냄새, 기타 피드백, 관중의 함성, 날 것의 에너지"

**기대 속성:**
- emotion: raw, intense 포함
- energy: high
- tempo_feel: fast
- genre: punk rock 포함
- atmosphere: underground venue 포함

### 케이스 3: 우주 앰비언트 (space_ambient)

**입력:** "끝없이 펼쳐진 우주, 완전한 고요, 별들의 숨소리"

**기대 속성:**
- emotion: contemplative, lonely 포함
- energy: low
- genre: ambient, space music 포함
- atmosphere: space, vast landscape 포함

---

## API 단위 테스트

```bash
# 헬스체크
curl http://localhost:8000/api/health

# 회원가입
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt

# 로그인
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mde.dev","password":"mde_admin_2026"}' \
  -c cookies.txt

# 분석 (인증 필요 없음)
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 1.2.3.4" \
  -d '{"input":"새벽 3시, 비 오는 날, 혼자 운전하는 느낌"}'

# 관리자 통계
curl http://localhost:8000/api/admin/stats -b cookies.txt
```

---

## 알려진 한계

1. **LLM 비결정성**: temperature=0.3이어도 실행마다 결과가 약간 다를 수 있음
2. **Gemini 무료 quota**: 분당 15 RPM / 일 1,500 RPD 제한
3. **언어 혼합**: 입력이 영어인 경우 summary가 영어로 나올 수 있음
4. **이미지 품질 의존성**: 저화질 또는 추상적 이미지는 Vision 결과가 부정확할 수 있음
