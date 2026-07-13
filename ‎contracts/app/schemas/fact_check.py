"""
Pydantic schemas for the fact-checking endpoints.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    """Payload for the basic string-matching search endpoint."""

    query: str = Field(
        ...,
        min_length=1,
        description="The search term (guideline keyword or title substring) to match.",
    )


class RuleResponse(BaseModel):
    """Represents a rule row in the SQLite guidelines table."""

    id: int
    chapter: str
    title: str
    content: str


class VerifyRequest(BaseModel):
    """Payload for the semantic fact-checking verify endpoint."""

    claim: str = Field(
        ...,
        min_length=5,
        description="The natural language claim made by the student/teacher to verify.",
    )


class VerifyResponse(BaseModel):
    """Definitive verification scorecard return schema."""

    status: str = Field(
        ...,
        description="Validation status: either '[TRUE]' or '[FALSE]'.",
    )
    confidence_score: float = Field(
        ...,
        description="Metric representing the system's confidence in the validation (0.0 to 1.0).",
    )
    exact_quote: str = Field(
        ...,
        description="The exact text quote from the official rulebook used to evaluate/debunk the claim.",
    )
    explanation: str = Field(
        ...,
        description="Brief reasoning describing how the rule matches, validates, or debunks the claim.",
    )
    matched_rules: list[RuleResponse] = Field(
        default_factory=list,
        description="The relevant rules retrieved from the rulebook.",
    )
