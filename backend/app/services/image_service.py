"""Image URL generation via Pollinations.ai (stub, extensible to ComfyUI)."""
import urllib.parse
import random
from typing import Optional


POLLINATIONS_BASE = "https://image.pollinations.ai/prompt"

# Genre → visual style mapping (ported from frontend image-prompt-builder.ts)
GENRE_STYLES: dict[str, str] = {
    "indie rock": "film grain, analog photography",
    "punk rock": "high contrast, raw energy, gritty texture",
    "ambient": "soft gradients, ethereal light, minimal",
    "lo-fi hip hop": "vintage illustration, warm tones, cassette texture",
    "electronic": "neon lights, digital glitch, holographic",
    "jazz": "smoky atmosphere, warm light, vintage",
    "folk": "natural textures, earthy tones, handcrafted feel",
    "shoegaze": "dreamy blur, washed-out colors, hazy light",
    "post-rock": "cinematic landscapes, dramatic light, vast",
    "synth-pop": "retro futuristic, pastel neon, 80s aesthetic",
    "r&b": "velvet textures, moody lighting, soulful warmth",
    "dream pop": "soft focus, pastel, floating, surreal",
    "space music": "cosmic, star fields, nebula colors, infinite",
}

ENERGY_VISUALS: dict[str, str] = {
    "low": "serene, quiet, minimal composition",
    "medium": "balanced, flowing, moderate contrast",
    "high": "dynamic, intense, bold composition",
}


def build_image_prompt(profile: dict) -> str:
    parts: list[str] = []

    visual = profile.get("visual_association", [])
    if visual:
        parts.append(", ".join(visual[:3]))

    atmosphere = profile.get("atmosphere", [])
    if atmosphere:
        parts.append(", ".join(atmosphere[:2]))

    genres = profile.get("genre", [])
    for g in genres[:2]:
        style = GENRE_STYLES.get(g.lower())
        if style:
            parts.append(style)

    energy = profile.get("energy", "medium")
    energy_desc = ENERGY_VISUALS.get(energy, "balanced")
    parts.append(energy_desc)

    emotions = profile.get("emotion", [])
    if emotions:
        parts.append(", ".join(emotions[:2]) + " mood")

    parts.append("album cover art, high quality, artistic")

    return ", ".join(parts)


def build_pollinations_url(profile: dict, width: int = 512, height: int = 512) -> str:
    prompt = build_image_prompt(profile)
    seed = random.randint(1, 999999)
    encoded = urllib.parse.quote(prompt)
    return f"{POLLINATIONS_BASE}/{encoded}?width={width}&height={height}&seed={seed}&model=flux"


def get_image_url(profile: Optional[dict]) -> Optional[str]:
    """Return image URL stub. Returns None if profile is missing."""
    if not profile:
        return None
    return build_pollinations_url(profile)
