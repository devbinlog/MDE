# MDE — 프로젝트 개요

## 프로젝트 정의

MDE(Music Direction Engine)는 사용자의 **텍스트 또는 이미지 입력**을 받아 음악의 방향성을 구조화된 형태로 도출하는 AI 시스템이다.

음악을 직접 추천하거나 생성하는 것이 아니라, "어떤 음악이 만들어져야 하는지"의 속성(감정, 분위기, 템포, 장르 등)을 정의하고 구조화하는 것이 목적이다.

---

## 핵심 개념

> "새벽 3시, 비 오는 날, 혼자 운전하는 느낌"
> → 감정: melancholic, lonely
> → 에너지: low / 템포: slow
> → 장르: indie pop, dream pop
> → 분위기: rainy night, foggy morning
> → 음악 방향: 헤비 리버브의 피아노 중심, BPM 60-75, 넓은 스테레오

이 과정이 MDE의 핵심이다.

---

## 문제 정의

| 문제 | 설명 |
|------|------|
| 방향성 부재 | 감정은 있지만 음악 언어(BPM, 키, 장르)로 변환하지 못함 |
| 협업 단절 | 아티스트-프로듀서 간 언어 불일치로 소통 실패 |
| 레퍼런스 과부하 | 레퍼런스는 많지만 자신만의 방향이 없음 |
| 멀티모달 입력 부재 | 이미지로 음악 느낌을 표현하고 싶지만 도구가 없음 |

---

## 솔루션 개요

```
입력 (텍스트 or 이미지)
  ↓
[이미지인 경우] Gemini Vision → 한국어 감성 묘사 텍스트
  ↓
MusicProfile 생성 (Gemini 2.0 Flash, temperature=0.3, JSON 스키마 강제)
  ↓
방향성 설명 생성 (음악/사운드/비주얼/콘텐츠)
  ↓
결과 저장 (SQLite) + 공유 링크 발급
```

---

## 출력 구조

### MusicProfile (9개 필드 + summary)

| 필드 | 타입 | 설명 |
|------|------|------|
| `emotion` | string[] | 감정 키워드 (영어) |
| `energy` | low/medium/high | 에너지 레벨 |
| `tempo_feel` | slow/mid/fast | 템포 감각 |
| `genre` | string[] | 장르 |
| `instrumentation` | string[] | 악기 편성 |
| `sound_direction` | string[] | 사운드 프로덕션 방향 |
| `atmosphere` | string[] | 분위기 키워드 |
| `visual_association` | string[] | 시각적 연상 키워드 |
| `listener_context` | string | 청취 맥락 |
| `content_goal` | enum | 콘텐츠 목적 |
| `summary` | string | 한 줄 요약 (한국어, 30-60자) |

### 방향성 설명 (4개 필드)

| 필드 | 설명 |
|------|------|
| `music_direction` | 전반적 음악 느낌, 구조, 감정 흐름 |
| `sound_direction` | 프로덕션 선택 (리버브, 믹스, 레이어) |
| `visual_direction` | 앨범 커버, 색상 팔레트, 아트워크 방향 |
| `content_usage` | 콘텐츠 활용 맥락, SNS 전략 |

---

## 서비스 범위

- [x] 텍스트 입력 → MusicProfile + 4개 방향성
- [x] 이미지 입력 → Gemini Vision → MusicProfile + 4개 방향성
- [x] 결과 저장 및 히스토리 (로그인 시)
- [x] 공유 링크 생성
- [x] 관리자 대시보드
- [ ] 실제 음악 생성 연동 (v2.0)
- [ ] 대화형 정제 (v1.5)
