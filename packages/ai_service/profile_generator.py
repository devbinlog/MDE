"""
FMD Profile Generator — MusicProfile generation with retry logic.
"""

import json
import re
import logging
from typing import Optional

from .models import MusicProfile
from .client import LLMClient
from .prompt_builder import PromptBuilder
from .exceptions import ProfileGenerationError

logger = logging.getLogger(__name__)

MAX_RETRIES = 3


class ProfileGenerator:
    """
    Generates MusicProfile from natural language input.
    Includes automatic retry with correction prompts.
    """

    def __init__(self, client: LLMClient, prompt_builder: PromptBuilder):
        self.client = client
        self.prompt_builder = prompt_builder

    async def generate(self, user_input: str) -> MusicProfile:
        """
        Generate MusicProfile from natural language input.

        Args:
            user_input: Natural language description of desired music

        Returns:
            Validated MusicProfile instance

        Raises:
            ProfileGenerationError: If generation fails after all retries
        """
        system, messages = self.prompt_builder.build_profile_prompt(user_input)
        last_error = None

        for attempt in range(1, MAX_RETRIES + 1):
            logger.info(f"Profile generation attempt {attempt}/{MAX_RETRIES}")

            try:
                raw = await self.client.complete(
                    system=system,
                    messages=messages,
                    json_mode=True,
                    temperature=0.3,
                    max_tokens=1024
                )

                data = json.loads(raw)
                profile = MusicProfile(**data)

                logger.info(
                    "profile_generated",
                    extra={"attempt": attempt, "genre": profile.genre}
                )
                return profile

            except json.JSONDecodeError as e:
                logger.warning(f"JSON parse error on attempt {attempt}: {e}")
                extracted = self._extract_json(raw)
                if extracted:
                    messages = self.prompt_builder.build_retry_prompt(
                        messages, extracted, f"JSON 파싱 오류: {e}"
                    )
                else:
                    messages = self.prompt_builder.build_retry_prompt(
                        messages, raw, f"JSON을 찾을 수 없음: {e}"
                    )
                last_error = e

            except Exception as e:
                logger.warning(f"Validation error on attempt {attempt}: {e}")
                messages = self.prompt_builder.build_retry_prompt(
                    messages, raw, str(e)
                )
                last_error = e

        raise ProfileGenerationError(
            f"MusicProfile 생성 실패 ({MAX_RETRIES}회 시도)",
            attempts=MAX_RETRIES,
            last_error=last_error
        )

    def _extract_json(self, text: str) -> Optional[str]:
        """Try to extract JSON object from text using regex."""
        pattern = r'\{[\s\S]*\}'
        matches = re.findall(pattern, text)
        if matches:
            # Return the longest match (most complete JSON)
            return max(matches, key=len)
        return None
