"""LLM API caller — supports Gemini and OpenRouter."""
import json
import re
from typing import Optional

import httpx

from app.core.config import get_settings

settings = get_settings()

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"


class GeminiRateLimitError(Exception):
    pass


class GeminiServiceError(Exception):
    pass


async def _call_openrouter(
    system_prompt: str,
    user_message: str,
    temperature: float,
    max_tokens: int,
    key: str,
    model: str,
) -> str:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(OPENROUTER_API_URL, json=payload, headers=headers)

    if resp.status_code == 429:
        raise GeminiRateLimitError("OpenRouter rate limit exceeded")
    if resp.status_code != 200:
        raise GeminiServiceError(f"OpenRouter API error {resp.status_code}: {resp.text[:300]}")

    data = resp.json()
    try:
        text = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        raise GeminiServiceError(f"Unexpected OpenRouter response structure: {e}") from e

    return text.strip()


async def _call_gemini_native(
    system_prompt: str,
    user_message: str,
    temperature: float,
    max_tokens: int,
    key: str,
    model: str,
) -> str:
    url = f"{GEMINI_API_BASE}/{model}:generateContent?key={key}"
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_message}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=payload)

    if resp.status_code == 429:
        raise GeminiRateLimitError("Gemini API rate limit exceeded")
    if resp.status_code != 200:
        raise GeminiServiceError(f"Gemini API error {resp.status_code}: {resp.text[:300]}")

    data = resp.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        raise GeminiServiceError(f"Unexpected Gemini response structure: {e}") from e

    return text.strip()


async def call_gemini(
    system_prompt: str,
    user_message: str,
    temperature: float = 0.3,
    max_tokens: int = 1024,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> str:
    """Call the configured LLM and return raw text response."""
    key = api_key or settings.llm_api_key
    mdl = model or settings.llm_model
    provider = settings.llm_provider

    if provider == "openrouter":
        return await _call_openrouter(system_prompt, user_message, temperature, max_tokens, key, mdl)
    return await _call_gemini_native(system_prompt, user_message, temperature, max_tokens, key, mdl)


def extract_json(text: str) -> dict:
    """Extract JSON from text that may contain markdown code blocks."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    clean = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract JSON from response: {text[:200]}")


IMAGE_DESCRIPTION_PROMPT = """이 이미지의 분위기, 감정, 장면을 음악 방향성 분석에 사용할 수 있도록 설명해주세요.
날씨, 시간대, 색감, 감정적 분위기, 공간감 등을 포함해 구체적이고 감각적으로 설명해주세요.
100자 이내의 한국어로만 답해주세요. 설명만 작성하고 다른 텍스트는 포함하지 마세요."""


async def describe_image(
    mime_type: str,
    base64_data: str,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> str:
    """Use Gemini Vision to convert an image to a text description for music analysis."""
    key = api_key or settings.llm_api_key
    mdl = model or settings.llm_model
    provider = settings.llm_provider

    if provider == "openrouter":
        # OpenRouter vision: use OpenAI-compatible image_url format with base64
        url_data = f"data:{mime_type};base64,{base64_data}"
        payload = {
            "model": mdl,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": url_data}},
                    {"type": "text", "text": IMAGE_DESCRIPTION_PROMPT},
                ],
            }],
            "max_tokens": 200,
            "temperature": 0.3,
        }
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(OPENROUTER_API_URL, json=payload, headers=headers)

        if resp.status_code == 429:
            raise GeminiRateLimitError("OpenRouter rate limit exceeded")
        if resp.status_code != 200:
            raise GeminiServiceError(f"OpenRouter Vision API error {resp.status_code}: {resp.text[:300]}")

        data = resp.json()
        try:
            text = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise GeminiServiceError(f"Unexpected OpenRouter response structure: {e}") from e

        return text.strip()

    # Gemini Vision
    url = f"{GEMINI_API_BASE}/{mdl}:generateContent?key={key}"
    payload = {
        "contents": [{
            "role": "user",
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": base64_data}},
                {"text": IMAGE_DESCRIPTION_PROMPT},
            ],
        }],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 200},
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=payload)

    if resp.status_code == 429:
        raise GeminiRateLimitError("Gemini API rate limit exceeded")
    if resp.status_code != 200:
        raise GeminiServiceError(f"Gemini Vision API error {resp.status_code}: {resp.text[:300]}")

    data = resp.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        raise GeminiServiceError(f"Unexpected Gemini response structure: {e}") from e

    return text.strip()
