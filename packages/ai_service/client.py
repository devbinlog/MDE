"""
FMD LLM Client — Provider Abstraction Layer
Supports OpenAI and Anthropic with automatic fallback.
"""

from abc import ABC, abstractmethod
from typing import Optional
import asyncio
import logging

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def complete(
        self,
        system: str,
        messages: list[dict],
        json_mode: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        """
        Send a completion request to the LLM.

        Args:
            system: System prompt
            messages: List of message dicts [{"role": "user", "content": "..."}]
            json_mode: Whether to force JSON output
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum output tokens

        Returns:
            LLM response string
        """
        ...


class OpenAIProvider(LLMProvider):
    """OpenAI GPT provider."""

    def __init__(self, api_key: str, model: str = "gpt-4o"):
        try:
            import openai
            self.client = openai.AsyncOpenAI(api_key=api_key)
        except ImportError:
            raise ImportError("openai package required: pip install openai")
        self.model = model

    async def complete(
        self,
        system: str,
        messages: list[dict],
        json_mode: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        kwargs = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = await self.client.chat.completions.create(**kwargs)
        return response.choices[0].message.content


class AnthropicProvider(LLMProvider):
    """Anthropic Claude provider."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-5"):
        try:
            import anthropic
            self.client = anthropic.AsyncAnthropic(api_key=api_key)
        except ImportError:
            raise ImportError("anthropic package required: pip install anthropic")
        self.model = model

    async def complete(
        self,
        system: str,
        messages: list[dict],
        json_mode: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        response = await self.client.messages.create(
            model=self.model,
            system=system,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.content[0].text


class LLMClient:
    """
    Main LLM client with primary/fallback provider support.
    Automatically falls back to secondary provider on failure.
    """

    def __init__(
        self,
        primary: LLMProvider,
        fallback: Optional[LLMProvider] = None,
        timeout: float = 30.0
    ):
        self.primary = primary
        self.fallback = fallback
        self.timeout = timeout

    async def complete(self, **kwargs) -> str:
        """
        Call LLM with automatic fallback.
        Falls back to secondary provider if primary fails.
        """
        try:
            return await asyncio.wait_for(
                self.primary.complete(**kwargs),
                timeout=self.timeout
            )
        except asyncio.TimeoutError:
            logger.warning("Primary LLM timeout, trying fallback")
        except Exception as e:
            logger.warning(f"Primary LLM error: {e}, trying fallback")

        if self.fallback:
            try:
                return await asyncio.wait_for(
                    self.fallback.complete(**kwargs),
                    timeout=self.timeout
                )
            except Exception as e:
                logger.error(f"Fallback LLM also failed: {e}")
                raise

        raise LLMProviderError("All LLM providers failed")


def create_llm_client(
    openai_api_key: str,
    anthropic_api_key: Optional[str] = None,
    primary_model: str = "gpt-4o"
) -> LLMClient:
    """Factory function to create configured LLMClient."""
    from .exceptions import LLMProviderError

    primary = OpenAIProvider(api_key=openai_api_key, model=primary_model)
    fallback = None

    if anthropic_api_key:
        fallback = AnthropicProvider(api_key=anthropic_api_key)

    return LLMClient(primary=primary, fallback=fallback)
