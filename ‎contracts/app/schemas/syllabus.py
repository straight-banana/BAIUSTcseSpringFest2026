"""
Pydantic schemas for syllabus-related request/response models.
"""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


# ═══════════════════════════════════════════════════════════════════════════════
# Requests
# ═══════════════════════════════════════════════════════════════════════════════


class SyllabusRequest(BaseModel):
    """Payload for the /summarize endpoint."""

    syllabus_text: str = Field(
        ...,
        min_length=20,
        description="The raw syllabus text pasted by the student.",
    )
    course_id: str | None = Field(
        default=None,
        description="Optional course identifier to load specific curriculum data for RAG.",
    )


class StudyPlanRequest(BaseModel):
    """Payload for the /study-plan endpoint."""

    syllabus_text: str = Field(
        ...,
        min_length=20,
        description="The raw syllabus text pasted by the student.",
    )
    test_date: date = Field(
        ...,
        description="The date of the upcoming exam (YYYY-MM-DD).",
    )
    hours_per_day: float = Field(
        default=3.0,
        gt=0,
        le=16,
        description="Number of hours the student can study per day.",
    )
    course_id: str | None = Field(
        default=None,
        description="Optional course identifier to load specific curriculum data for RAG.",
    )


# ═══════════════════════════════════════════════════════════════════════════════
# Responses
# ═══════════════════════════════════════════════════════════════════════════════


class SummarizeResponse(BaseModel):
    """Response from the /summarize endpoint."""

    topics: list[str] = Field(
        ...,
        description="Clean, examinable topics extracted from the syllabus.",
    )
    filtered_count: int = Field(
        default=0,
        description="Number of non-examinable items that were filtered out.",
    )
    rag_context_used: bool = Field(
        default=False,
        description="Whether curriculum RAG context was used for filtering.",
    )


class StudyBlock(BaseModel):
    """A single time-blocked study session."""

    date: date
    time_slot: str = Field(
        ...,
        description="Suggested time window, e.g. '09:00-10:30'.",
    )
    topic: str
    subtopics: list[str] = Field(default_factory=list)
    priority: str = Field(
        ...,
        description="Priority level: high, medium, or low.",
    )
    estimated_minutes: int = Field(
        ...,
        gt=0,
        description="Estimated study time in minutes for this block.",
    )


class StudyPlanResponse(BaseModel):
    """Response from the /study-plan endpoint."""

    plan: list[StudyBlock]
    total_topics: int
    total_study_hours: float
    days_until_test: int
    rag_context_used: bool = False
