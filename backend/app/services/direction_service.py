"""3-way parallel music direction generation using asyncio.gather."""
import asyncio
import logging
from typing import Any

from app.services.gemini_service import call_gemini, extract_json, GeminiRateLimitError

logger = logging.getLogger(__name__)

# ── Prompts (ported from frontend/src/lib/ai-service/prompt-builder.ts) ──

PROFILE_SYSTEM_PROMPT = """You are MDE (Find My Direction), an expert music direction AI.

Analyze the user's music idea and extract structured creative direction.
Return ONLY a valid JSON object matching this exact schema. No explanation, no markdown.

Schema:
{
  "emotion": ["string (2-5 items, English keywords: melancholic, nostalgic, excited, lonely, raw, dreamy, intense, bittersweet, euphoric, hopeful, contemplative)"],
  "energy": "low | medium | high",
  "tempo_feel": "slow | mid | fast",
  "genre": ["string (1-3 items: indie rock, punk rock, ambient, lo-fi hip hop, electronic, jazz, folk, shoegaze, post-rock, synth-pop, R&B, dream pop, space music)"],
  "instrumentation": ["string (2-6 items: clean guitar, distorted guitar, acoustic guitar, electric piano, synth pad, drum machine, soft kick, live drums, bass, strings, brass, vocal, processed vocal)"],
  "sound_direction": ["string (2-5 items: heavy reverb, dry vocal, wide stereo pad, punchy snare, warm compression, bright mix, dark mix, layered harmonics, minimal arrangement, lush production, granular texture)"],
  "atmosphere": ["string (2-4 items: rainy night, live concert, empty street, space, golden hour, neon city, foggy morning, intimate room, vast landscape, underground venue, weightless)"],
  "visual_association": ["string (2-5 items, concrete visual keywords)"],
  "listener_context": "string (short phrase, can be Korean)",
  "content_goal": "album_cover | live_performance | demo_planning | playlist_mood | concept_planning",
  "summary": "string (one Korean sentence, 30-60 chars, concrete and specific)"
}

Rules:
- Return ONLY JSON. No other text.
- Make reasonable assumptions when input is vague.
- Do not name specific copyrighted artists.
- summary must be in Korean and specific."""

EXPLANATION_SYSTEM_PROMPT = """You are MDE (Find My Direction), an expert music creative director.

Given a MusicProfile JSON, generate a human-readable explanation in Korean.
Return ONLY a valid JSON object with these four fields:

{
  "music_direction": "string (2-4 Korean sentences about the overall music feeling, structure, and emotional journey)",
  "sound_direction": "string (2-4 Korean sentences about specific production choices: reverb, mix width, instrument layers)",
  "visual_direction": "string (2-3 Korean sentences about album cover concept, color palette, photography style)",
  "content_usage": "string (2-3 Korean sentences about when/how this music would be used, SNS strategy)"
}

Rules:
- Write in Korean only
- Be concrete and specific, not generic
- Each field must be independently useful as creative direction
- Do not repeat the same phrases across fields
- Return ONLY JSON. No other text."""


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


def _make_fallback_explanation(profile: dict) -> dict:
    """Simple fallback if explanation LLM call fails."""
    genre = ", ".join(profile.get("genre", ["음악"]))
    emotion = ", ".join(profile.get("emotion", ["감성적"]))
    return {
        "music_direction": f"{genre} 장르의 {emotion} 분위기를 담은 음악입니다.",
        "sound_direction": "사운드 방향은 프로파일을 참고해 주세요.",
        "visual_direction": "비주얼 방향은 프로파일을 참고해 주세요.",
        "content_usage": "다양한 콘텐츠에 활용 가능합니다.",
    }


async def generate_all_directions(
    input_text: str,
    options: dict | None = None,
) -> dict[str, Any]:
    """
    Generate MusicProfile and DirectionExplanation in parallel.
    Returns: { musicProfile: dict, explanation: dict }
    """
    profile_msg = _build_profile_user_message(input_text, options)

    # Step 1: Generate profile (sequential — explanation depends on it)
    profile_raw = await call_gemini(PROFILE_SYSTEM_PROMPT, profile_msg, temperature=0.3)
    music_profile = extract_json(profile_raw)

    # Step 2: Generate explanation from profile
    import json as _json
    explanation_msg = _json.dumps(music_profile, ensure_ascii=False, indent=2)

    try:
        expl_raw = await call_gemini(
            EXPLANATION_SYSTEM_PROMPT,
            explanation_msg,
            temperature=0.7,
            max_tokens=1024,
        )
        explanation = extract_json(expl_raw)
    except Exception as e:
        logger.warning("Explanation generation failed, using fallback: %s", e)
        explanation = _make_fallback_explanation(music_profile)

    return {"musicProfile": music_profile, "explanation": explanation}
