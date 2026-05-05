"""
FMD Prompt Builder — Constructs LLM prompts from templates and few-shot examples.
"""

import json
import os
from pathlib import Path
from typing import Optional

from .models import MusicProfile


PROMPTS_DIR = Path(__file__).parent.parent.parent / "prompts"

FEWSHOT_EXAMPLES = [
    {
        "input": "새벽 3시, 비 오는 날, 혼자 운전하는 느낌",
        "output": {
            "emotion": ["lonely", "melancholic", "nostalgic"],
            "energy": "low",
            "tempo_feel": "slow_drifting",
            "genre": ["indie_pop", "dream_pop"],
            "instrumentation": ["piano", "muted_guitar", "light_drums", "reverb_guitar"],
            "atmosphere": ["rainy", "nocturnal", "isolated"],
            "visual_association": ["neon_reflections", "empty_roads", "blurred_windows"],
            "listener_context": "late_night_drive",
            "content_goal": "emotional_release"
        }
    },
    {
        "input": "에너지 넘치는 클럽 음악, 새벽 4시 피크타임",
        "output": {
            "emotion": ["euphoric", "energetic", "confident"],
            "energy": "very_high",
            "tempo_feel": "frantic",
            "genre": ["edm", "house"],
            "instrumentation": ["synthesizer", "808_bass", "drum_machine", "vocal_chops", "pad"],
            "atmosphere": ["urban", "crowded", "warm"],
            "visual_association": ["strobe_lights", "crowd_silhouette", "laser_beams"],
            "listener_context": "party",
            "content_goal": "celebration"
        }
    },
    {
        "input": "공부할 때 듣는 잔잔한 로파이, 집중이 잘 되는",
        "output": {
            "emotion": ["contemplative", "serene", "focused"],
            "energy": "low",
            "tempo_feel": "walking",
            "genre": ["lo_fi_hip_hop"],
            "instrumentation": ["rhodes", "bass_guitar", "brushed_drums", "saxophone"],
            "atmosphere": ["nocturnal", "indoor", "warm", "hazy"],
            "visual_association": ["desk_lamp", "coffee_steam", "rain_on_window"],
            "listener_context": "studying",
            "content_goal": "focus"
        }
    }
]

SYSTEM_PROFILE = """You are FMD (Find My Direction), an expert music direction AI.
Your role is to interpret natural language descriptions and convert them into structured MusicProfile JSON.

STRICT RULES:
1. Always output ONLY valid JSON matching the MusicProfile schema exactly.
2. Never add fields not in the schema.
3. All array fields must have at least 1 value.
4. Use ONLY these values for energy: very_low, low, medium, high, very_high
5. Use ONLY these values for tempo_feel: crawling, slow_drifting, walking, steady_groove, driving, rushing, frantic
6. Use ONLY these values for content_goal: emotional_release, motivation, relaxation, focus, storytelling, celebration, social_connection, artistic_expression, commercial
7. For emotion, use only: joyful, euphoric, hopeful, romantic, playful, energetic, warm, proud, grateful, inspired, serene, confident, sad, lonely, melancholic, anxious, frustrated, angry, desperate, hopeless, betrayed, grief-stricken, nostalgic, contemplative, mysterious, surreal, dreamy, detached, numb, bittersweet, tense, uncertain, focused
8. Consider Korean cultural music context (K-indie, City Pop, K-pop etc.)
9. Return ONLY the JSON object. No explanation, no markdown, no text before/after."""

SYSTEM_MUSIC_DIRECTION = """You are a professional music producer and creative director.
Given a MusicProfile JSON, write a concrete music production direction in Korean.
- Length: 300-500 characters
- Be specific: mention BPM range, key signature feeling, sound palette
- Reference real artists or songs (optional but preferred)
- Use professional music production terminology
- Focus on HOW to create the music, not just what it sounds like"""

SYSTEM_VISUAL_DIRECTION = """You are a music video director and visual artist.
Given a MusicProfile JSON, write a visual direction guide in Korean.
- Length: 200-400 characters
- Describe: color palette, lighting, location/setting, camera style
- Cover both music video concept and cover art direction
- Mention art/film references when relevant"""

SYSTEM_CONTENT_DIRECTION = """You are a music marketing strategist and content creator.
Given a MusicProfile JSON, write a content strategy direction in Korean.
- Length: 200-400 characters
- Cover: SNS platform strategy, target audience, posting timing
- Suggest hashtag concepts
- Align with the music's emotional goal"""


class PromptBuilder:
    """Builds LLM prompts for all FMD generation tasks."""

    def build_profile_prompt(self, user_input: str) -> tuple[str, list[dict]]:
        """Build prompt for MusicProfile generation."""
        messages = []

        # Add few-shot examples
        for example in FEWSHOT_EXAMPLES:
            messages.append({
                "role": "user",
                "content": example["input"]
            })
            messages.append({
                "role": "assistant",
                "content": json.dumps(example["output"], ensure_ascii=False)
            })

        # Add actual user input
        messages.append({
            "role": "user",
            "content": user_input
        })

        return SYSTEM_PROFILE, messages

    def build_retry_prompt(
        self,
        messages: list[dict],
        previous_attempt: str,
        error: str
    ) -> list[dict]:
        """Build correction prompt for retry attempts."""
        retry_messages = messages.copy()
        retry_messages.append({
            "role": "assistant",
            "content": previous_attempt
        })
        retry_messages.append({
            "role": "user",
            "content": f"""The previous response had validation errors: {error}

Please fix the MusicProfile JSON to:
1. Include ALL required fields: emotion, energy, tempo_feel, genre, instrumentation, atmosphere, visual_association, listener_context, content_goal
2. Use ONLY allowed enum values
3. Return ONLY valid JSON, no other text"""
        })
        return retry_messages

    def build_music_direction_prompt(self, profile: MusicProfile) -> tuple[str, list[dict]]:
        """Build prompt for Music Direction generation."""
        messages = [{
            "role": "user",
            "content": f"MusicProfile:\n{profile.model_dump_json(indent=2, ensure_ascii=False)}"
        }]
        return SYSTEM_MUSIC_DIRECTION, messages

    def build_visual_direction_prompt(self, profile: MusicProfile) -> tuple[str, list[dict]]:
        """Build prompt for Visual Direction generation."""
        messages = [{
            "role": "user",
            "content": f"MusicProfile:\n{profile.model_dump_json(indent=2, ensure_ascii=False)}"
        }]
        return SYSTEM_VISUAL_DIRECTION, messages

    def build_content_direction_prompt(self, profile: MusicProfile) -> tuple[str, list[dict]]:
        """Build prompt for Content Direction generation."""
        messages = [{
            "role": "user",
            "content": f"MusicProfile:\n{profile.model_dump_json(indent=2, ensure_ascii=False)}"
        }]
        return SYSTEM_CONTENT_DIRECTION, messages
