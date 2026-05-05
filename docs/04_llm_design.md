# MDE — LLM 설계

## 모델 선택

**Gemini 2.0 Flash** (Google AI Studio 무료 티어)

| 항목 | 값 |
|------|-----|
| 모델 ID | `gemini-2.0-flash` |
| 무료 한도 | 15 RPM / 1,500 RPD |
| 멀티모달 | 텍스트 + 이미지(Vision) 지원 |
| 컨텍스트 | 1M 토큰 |

선택 이유: 무료 티어에서 Vision 멀티모달을 지원하고, JSON 구조화 출력에서 충분한 정확도를 보임.

---

## 호출 구조

### 텍스트 분석: 2단계 순차 호출

```
1. MusicProfile 생성
   - system: PROFILE_SYSTEM_PROMPT
   - user: 입력 텍스트 (+ 선택적 힌트)
   - temperature: 0.3  ← 낮은 온도로 출력 분산 최소화
   - max_tokens: 512

2. 방향성 설명 생성 (1의 결과를 입력으로 사용)
   - system: EXPLANATION_SYSTEM_PROMPT
   - user: MusicProfile JSON
   - temperature: 0.7  ← 창의적 텍스트 생성
   - max_tokens: 1024
```

### 이미지 분석: 1단계 추가 (Vision)

```
0. 이미지 → 텍스트 변환
   - system: IMAGE_DESCRIPTION_PROMPT
   - user: [image] + "이 이미지의 분위기를 설명해주세요"
   - temperature: 0.5
   → 한국어 감성 묘사 텍스트 (~100자)

이후 텍스트 분석 2단계와 동일
```

---

## 프롬프트 설계 원칙

### 1. JSON 스키마 강제
시스템 프롬프트에 출력 스키마를 명시하고 "Return ONLY a valid JSON object"를 지시.
마크다운 코드블록 포함 시 `extract_json()`으로 파싱.

### 2. temperature 분리
- Profile 생성 (구조적 정확도 우선): `temperature=0.3`
- 설명 생성 (창의적 텍스트): `temperature=0.7`

### 3. 속성별 열거형 제한
프롬프트에 허용 값을 열거해 분산을 줄임:

```
"energy": "low | medium | high"
"tempo_feel": "slow | mid | fast"
"content_goal": "album_cover | live_performance | demo_planning | playlist_mood | concept_planning"
```

### 4. Fallback 처리
설명 생성 실패 시 MusicProfile 데이터로 기본 텍스트 생성:

```python
def _make_fallback_explanation(profile: dict) -> dict:
    genre = ", ".join(profile.get("genre", ["음악"]))
    emotion = ", ".join(profile.get("emotion", ["감성적"]))
    return {
        "music_direction": f"{genre} 장르의 {emotion} 분위기를 담은 음악입니다.",
        ...
    }
```

---

## Gemini API 호출 구현

```python
async def call_gemini(
    system_prompt: str,
    user_message: str,
    temperature: float = 0.5,
    max_tokens: int = 512,
) -> str:
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_message}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(GEMINI_URL, json=payload)
    # 429 → GeminiRateLimitError, 기타 오류 → GeminiServiceError
```

---

## JSON 파싱 전략

LLM이 마크다운 코드블록으로 감싸는 경우를 처리:

```python
def extract_json(text: str) -> dict:
    # 1. ```json ... ``` 제거
    # 2. ``` ... ``` 제거
    # 3. json.loads() 시도
    # 4. 실패 시 GeminiServiceError 발생
```

---

## 에러 처리

| HTTP 코드 | 원인 | 처리 |
|-----------|------|------|
| 429 | Gemini 무료 quota 초과 | GeminiRateLimitError → 사용자에게 한국어 안내 |
| 500+ | Gemini 서버 오류 | GeminiServiceError → 502 반환 |
| JSON 파싱 실패 | 비정형 응답 | GeminiServiceError → 502 반환 |
