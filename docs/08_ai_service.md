# MDE — AI 서비스 상세

## 서비스 파일 구조

```
backend/app/services/
├── gemini_service.py      # Gemini API 직접 호출
├── direction_service.py   # MusicProfile + 설명 생성 오케스트레이션
└── image_service.py       # Pollinations.ai 앨범 커버 URL 생성
```

---

## gemini_service.py

### `call_gemini()`

Gemini 2.0 Flash에 텍스트 요청을 보내는 핵심 함수.

```python
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{settings.llm_model}:generateContent?key={settings.llm_api_key}"
)

async def call_gemini(system_prompt, user_message, temperature=0.5, max_tokens=512) -> str:
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_message}]}],
        "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens},
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(GEMINI_URL, json=payload)
    if resp.status_code == 429:
        raise GeminiRateLimitError()
    if resp.status_code >= 400:
        raise GeminiServiceError(f"Gemini API error: {resp.status_code}")
    data = resp.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]
```

### `describe_image()`

Gemini Vision으로 이미지를 한국어 감성 묘사로 변환.

```python
IMAGE_DESCRIPTION_PROMPT = """
이 이미지를 보고 음악 분위기 분석을 위한 설명을 한국어로 작성해주세요.
장소, 시간대, 날씨, 감정, 분위기를 중심으로 2-3문장으로 묘사하세요.
음악적 감성에 집중하고, 구체적인 사물 나열보다 전체적인 무드를 표현하세요.
"""

async def describe_image(mime_type: str, base64_data: str) -> str:
    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": mime_type, "data": base64_data}},
                {"text": "이 이미지의 분위기와 감성을 음악 방향성 분석을 위한 텍스트로 설명해주세요."}
            ]
        }],
        "system_instruction": {"parts": [{"text": IMAGE_DESCRIPTION_PROMPT}]},
        "generationConfig": {"temperature": 0.5, "maxOutputTokens": 200},
    }
    # ... httpx 호출
```

### `extract_json()`

LLM 응답에서 JSON 추출. 마크다운 코드블록 처리.

```python
def extract_json(text: str) -> dict:
    # ```json ... ``` 제거
    cleaned = re.sub(r'```(?:json)?\s*', '', text)
    cleaned = re.sub(r'```\s*', '', cleaned).strip()
    return json.loads(cleaned)
```

---

## direction_service.py

### `generate_all_directions()`

2단계 순차 호출로 MusicProfile + 방향성 설명 생성.

```python
async def generate_all_directions(input_text: str, options: dict | None = None) -> dict:
    profile_msg = _build_profile_user_message(input_text, options)

    # Step 1: MusicProfile 생성 (temperature=0.3 - 낮은 분산)
    profile_raw = await call_gemini(PROFILE_SYSTEM_PROMPT, profile_msg, temperature=0.3)
    music_profile = extract_json(profile_raw)

    # Step 2: 방향성 설명 생성 (profile 기반, temperature=0.7 - 창의적)
    explanation_msg = json.dumps(music_profile, ensure_ascii=False, indent=2)
    try:
        expl_raw = await call_gemini(EXPLANATION_SYSTEM_PROMPT, explanation_msg, temperature=0.7, max_tokens=1024)
        explanation = extract_json(expl_raw)
    except Exception:
        explanation = _make_fallback_explanation(music_profile)

    return {"musicProfile": music_profile, "explanation": explanation}
```

### `_build_profile_user_message()`

옵션 힌트를 입력에 추가:

```python
def _build_profile_user_message(input_text: str, options: dict | None = None) -> str:
    msg = input_text
    if options:
        if options.get("emotion"):
            msg += f"\n\nEmotion hints: {', '.join(options['emotion'])}"
        if options.get("genre"):
            msg += f"\nGenre hints: {', '.join(options['genre'])}"
        if options.get("content_goal"):
            msg += f"\nContent goal: {options['content_goal']}"
    return msg
```

---

## image_service.py

Pollinations.ai를 사용한 앨범 커버 이미지 URL 생성.

```python
def build_pollinations_url(music_profile: dict) -> str:
    genre = ", ".join(music_profile.get("genre", ["music"]))
    atmosphere = ", ".join(music_profile.get("atmosphere", ["abstract"]))
    visual = ", ".join(music_profile.get("visual_association", []))
    emotion = ", ".join(music_profile.get("emotion", []))

    prompt = f"album cover art, {genre}, {atmosphere}, {visual}, {emotion}, cinematic, high quality"
    encoded = urllib.parse.quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"
```

실제 이미지 생성은 Pollinations.ai 서버에서 처리. 프론트엔드 `AlbumMockup.tsx`에서 `<img src={imageUrl}>`로 표시.
