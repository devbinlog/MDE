# Data Agent

## 역할

데이터 모델 설계, 테스트 데이터 구성, 평가 방법론.

## 담당 영역

- DB 스키마 설계 (users, analysis_sessions, shares)
- 테스트 입력/출력 데이터 구성 (`samples/`)
- Golden Set 정의 (기대 출력의 기준)
- LLM 출력 평가 지표 설계
- 데이터 마이그레이션 전략 (SQLite → PostgreSQL)

## 테스트 데이터 전략

3개의 전형적 입력 케이스를 선정:

| 케이스 | 특징 |
|--------|------|
| `rainy_night` | 저에너지, 감성적, 인디팝 계열 |
| `punk_live` | 고에너지, 날것, 펑크 계열 |
| `space_ambient` | 저에너지, 명상적, 앰비언트 계열 |

각 케이스에 대해 기대 MusicProfile 속성을 정의하고
실제 LLM 출력과 비교해 일치율을 측정.

## Golden Set

`samples/golden_set.json`: 각 케이스에서 핵심적으로 포함되어야 할 속성 목록.
평가 시 실제 출력이 golden set의 속성을 포함하는지 확인.
