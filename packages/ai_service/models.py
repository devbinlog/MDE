"""
FMD Data Models — MusicProfile Pydantic Schema
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional

VALID_EMOTIONS = {
    "joyful", "euphoric", "hopeful", "romantic", "playful", "energetic",
    "warm", "proud", "grateful", "inspired", "serene", "confident",
    "sad", "lonely", "melancholic", "anxious", "frustrated", "angry",
    "desperate", "hopeless", "betrayed", "grief-stricken",
    "nostalgic", "contemplative", "mysterious", "surreal", "dreamy",
    "detached", "numb", "bittersweet", "tense", "uncertain", "focused",
}

EnergyLevel = Literal["very_low", "low", "medium", "high", "very_high"]
TempoFeel = Literal[
    "crawling", "slow_drifting", "walking",
    "steady_groove", "driving", "rushing", "frantic"
]
ContentGoal = Literal[
    "emotional_release", "motivation", "relaxation", "focus",
    "storytelling", "celebration", "social_connection",
    "artistic_expression", "commercial"
]


class MusicProfile(BaseModel):
    """
    FMD Core Data Model.
    Structured representation of musical direction derived from natural language.
    """
    emotion: List[str] = Field(
        ...,
        min_length=1,
        max_length=5,
        description="List of emotions the music should convey (1-5)"
    )
    energy: EnergyLevel = Field(
        ...,
        description="Energy level of the music"
    )
    tempo_feel: TempoFeel = Field(
        ...,
        description="Perceived tempo/pace of the music"
    )
    genre: List[str] = Field(
        ...,
        min_length=1,
        max_length=3,
        description="Primary genre and sub-genres (first item = primary)"
    )
    instrumentation: List[str] = Field(
        ...,
        min_length=1,
        max_length=7,
        description="Recommended instruments"
    )
    atmosphere: List[str] = Field(
        ...,
        min_length=1,
        max_length=4,
        description="Environmental atmosphere and texture"
    )
    visual_association: List[str] = Field(
        ...,
        min_length=1,
        max_length=5,
        description="Visual images associated with the music"
    )
    listener_context: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Context/situation where this music would be listened"
    )
    content_goal: ContentGoal = Field(
        ...,
        description="The goal this music should achieve for the listener"
    )

    @field_validator("emotion")
    @classmethod
    def validate_emotions(cls, v: List[str]) -> List[str]:
        invalid = [e for e in v if e not in VALID_EMOTIONS]
        if invalid:
            raise ValueError(
                f"Invalid emotion value(s): {invalid}. "
                f"Must be one of: {sorted(VALID_EMOTIONS)}"
            )
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "emotion": ["lonely", "nostalgic"],
                "energy": "low",
                "tempo_feel": "slow_drifting",
                "genre": ["indie_pop", "dream_pop"],
                "instrumentation": ["piano", "muted_guitar", "light_drums"],
                "atmosphere": ["rainy", "nocturnal", "isolated"],
                "visual_association": ["neon_reflections", "empty_roads"],
                "listener_context": "late_night_drive",
                "content_goal": "emotional_release"
            }
        }
    }


class DirectionOutput(BaseModel):
    """Complete direction output including profile and all directions."""
    session_id: str
    profile: MusicProfile
    music_direction: Optional[str] = None
    visual_direction: Optional[str] = None
    content_direction: Optional[str] = None
