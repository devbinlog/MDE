# MusicProfile 프롬프트 설계 노트

## 목적

사용자의 자유형식 텍스트 입력을 9개 필드의 구조화된 MusicProfile JSON으로 변환.

## 핵심 설계 결정

### 1. JSON 스키마 강제
프롬프트 내에 정확한 출력 스키마를 명시하고 "Return ONLY a valid JSON" 지시.
LLM이 마크다운 코드블록으로 감싸는 경우를 대비해 `extract_json()`으로 후처리.

### 2. 허용값 열거
`energy`, `tempo_feel`, `content_goal`의 허용값을 파이프(`|`)로 명시.
열거형 강제가 없는 열린 필드(`emotion`, `genre`)는 예시 목록 제공.

### 3. temperature=0.3
구조적 일관성 우선. 실험 결과 에너지/장르 일치율이 가장 높은 값.
(experiment-001.md 참고)

### 4. 저작권 아티스트 배제
"Do not name specific copyrighted artists" 지시.
대신 장르, 분위기, 악기로 방향성 표현.

### 5. summary 한국어 강제
30-60자 한국어 한 문장. 프론트엔드 카드 UI에 표시되는 핵심 문구.

## 옵션 힌트 활용

`_build_profile_user_message()`에서 옵션을 입력에 추가:

```
[사용자 입력]

Emotion hints: melancholic, nostalgic
Genre hints: indie pop
Content goal: album_cover
```

사용자가 선택한 힌트가 있을 경우에만 추가. 입력 표현에 영향 없음.
