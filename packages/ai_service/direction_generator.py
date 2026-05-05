"""
FMD Direction Generator — Parallel generation of Music/Visual/Content directions.
"""

import asyncio
import logging
from typing import Optional

from .models import MusicProfile
from .client import LLMClient
from .prompt_builder import PromptBuilder
from .exceptions import DirectionGenerationError

logger = logging.getLogger(__name__)


class DirectionGenerator:
    """
    Generates Music, Visual, and Content directions from MusicProfile.
    All three directions are generated in parallel using asyncio.gather.
    """

    def __init__(self, client: LLMClient, prompt_builder: PromptBuilder):
        self.client = client
        self.prompt_builder = prompt_builder

    async def generate_all(self, profile: MusicProfile) -> dict[str, Optional[str]]:
        """
        Generate all three directions in parallel.

        Args:
            profile: Validated MusicProfile

        Returns:
            Dict with music_direction, visual_direction, content_direction
            Failed directions will be None (not propagated as exceptions)
        """
        results = await asyncio.gather(
            self._safe_generate("music", profile),
            self._safe_generate("visual", profile),
            self._safe_generate("content", profile),
            return_exceptions=False
        )

        return {
            "music_direction": results[0],
            "visual_direction": results[1],
            "content_direction": results[2],
        }

    async def _safe_generate(
        self, direction_type: str, profile: MusicProfile
    ) -> Optional[str]:
        """Generate a single direction, returning None on failure."""
        try:
            return await self._generate(direction_type, profile)
        except Exception as e:
            logger.error(
                f"Direction generation failed",
                extra={"type": direction_type, "error": str(e)}
            )
            return None

    async def _generate(self, direction_type: str, profile: MusicProfile) -> str:
        """Generate a single direction type."""
        builders = {
            "music": self.prompt_builder.build_music_direction_prompt,
            "visual": self.prompt_builder.build_visual_direction_prompt,
            "content": self.prompt_builder.build_content_direction_prompt,
        }

        temperatures = {
            "music": 0.7,
            "visual": 0.8,
            "content": 0.7,
        }

        builder = builders[direction_type]
        system, messages = builder(profile)

        result = await self.client.complete(
            system=system,
            messages=messages,
            json_mode=False,
            temperature=temperatures[direction_type],
            max_tokens=512
        )

        logger.info(
            "direction_generated",
            extra={"type": direction_type, "length": len(result)}
        )
        return result
