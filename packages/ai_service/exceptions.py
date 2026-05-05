"""
FMD AI Service Custom Exceptions
"""


class FMDAIError(Exception):
    """Base exception for FMD AI Service."""
    pass


class ProfileGenerationError(FMDAIError):
    """
    Raised when MusicProfile generation fails after all retries.
    """
    def __init__(self, message: str, attempts: int = 0, last_error: Exception = None):
        super().__init__(message)
        self.attempts = attempts
        self.last_error = last_error


class DirectionGenerationError(FMDAIError):
    """
    Raised when Direction generation fails.
    """
    def __init__(self, direction_type: str, message: str):
        super().__init__(f"{direction_type} direction failed: {message}")
        self.direction_type = direction_type


class IntentAnalysisError(FMDAIError):
    """
    Raised when input is not music-related.
    """
    pass


class LLMProviderError(FMDAIError):
    """
    Raised when LLM provider (OpenAI/Anthropic) is unavailable.
    """
    pass
