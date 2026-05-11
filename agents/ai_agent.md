# AI Agent

## 역할

LLM 프롬프트 설계, AI 서비스 구현, 출력 품질 관리.

## 담당 영역

- Gemini API 연동 (`gemini_service.py`)
- MusicProfile 생성 프롬프트 설계 및 최적화
- 방향성 설명 생성 프롬프트 설계
- 이미지 → 텍스트 변환 (Gemini Vision) 프롬프트
- LLM 출력 일관성 개선 (temperature 튜닝, 스키마 강제)
- JSON 파싱 전략 (`extract_json`)
- Fallback 처리

## LLM 선택 근거

**Gemini 2.0 Flash** 선택:
- 무료 티어에서 Vision(이미지) 지원
- JSON 구조화 출력에서 충분한 정확도
- 1M 토큰 컨텍스트 (긴 프롬프트 처리 가능)
- 빠른 응답 속도

## 핵심 설계 결정

### temperature 분리
- MusicProfile 생성: `0.3` — 구조적 일관성 우선
- 방향성 설명: `0.7` — 창의적 텍스트 허용

### 속성 편향 방지
특정 표현이 일부 속성에 과도한 영향을 주는 패턴 발견.
→ 열거형 허용값을 프롬프트에 명시해 분산 감소.
→ 실험 결과: energy 일치율 76% → 95% 향상 (experiment-001.md 참고)

### 순차 호출
Profile 생성 결과를 Explanation 입력으로 사용하는 의존성 때문에 순차 실행.
