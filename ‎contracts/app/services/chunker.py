"""
Programmatic text chunking for syllabus and curriculum documents.

This is NOT done by an LLM — chunking is a deterministic text-processing step.
The embedding model (Nemotron) is used *after* chunking to vectorise each chunk.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass
class TextChunk:
    """A single chunk of text with metadata."""

    content: str
    index: int
    source: str = "unknown"
    metadata: dict = field(default_factory=dict)

    @property
    def token_estimate(self) -> int:
        """Rough token count (≈ words × 1.3)."""
        return int(len(self.content.split()) * 1.3)


# ── Precompiled patterns for syllabus-aware splitting ──
_SECTION_BREAK = re.compile(
    r"\n\s*\n"                                     # blank lines
    r"|(?=\n\s*(?:Chapter|Unit|Module|Section)\s)",  # chapter headings
    re.IGNORECASE,
)
_NUMBERED_HEADER = re.compile(
    r"^(?:\d+[\.\)]\s|[A-Z][\.\)]\s|[-•●]\s)",      # bullets / numbered lists
    re.MULTILINE,
)


def chunk_text(
    text: str,
    *,
    max_chars: int = 512,
    overlap: int = 64,
    source: str = "input",
) -> list[TextChunk]:
    """
    Split *text* into overlapping chunks that respect sentence boundaries.

    Strategy
    --------
    1. Split on section breaks (double newlines, chapter headers).
    2. If a section is still too long, split on sentence boundaries.
    3. Apply sliding-window overlap between consecutive chunks.
    """
    if not text or not text.strip():
        return []

    # Phase 1: coarse split on structural boundaries
    raw_sections = _SECTION_BREAK.split(text.strip())
    raw_sections = [s.strip() for s in raw_sections if s and s.strip()]

    # Phase 2: refine — ensure every piece fits within max_chars
    fine_pieces: list[str] = []
    for section in raw_sections:
        if len(section) <= max_chars:
            fine_pieces.append(section)
        else:
            fine_pieces.extend(_split_by_sentences(section, max_chars))

    # Phase 3: merge tiny pieces back together to avoid fragment chunks
    merged = _merge_small_pieces(fine_pieces, max_chars)

    # Phase 4: apply overlap window
    chunks: list[TextChunk] = []
    for idx, piece in enumerate(merged):
        content = piece
        # Prepend overlap from previous chunk for context continuity
        if overlap > 0 and idx > 0:
            prev_tail = merged[idx - 1][-overlap:]
            content = prev_tail + " " + piece

        chunks.append(
            TextChunk(
                content=content.strip(),
                index=idx,
                source=source,
            )
        )

    return chunks


def _split_by_sentences(text: str, max_chars: int) -> list[str]:
    """Split text into segments at sentence boundaries."""
    # Split on sentence-ending punctuation followed by whitespace
    sentences = re.split(r"(?<=[.!?])\s+", text)
    pieces: list[str] = []
    current = ""

    for sentence in sentences:
        candidate = f"{current} {sentence}".strip() if current else sentence
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                pieces.append(current)
            # Handle individual sentences longer than max_chars
            if len(sentence) > max_chars:
                for i in range(0, len(sentence), max_chars):
                    pieces.append(sentence[i : i + max_chars])
                current = ""
            else:
                current = sentence

    if current:
        pieces.append(current)

    return pieces


def _merge_small_pieces(pieces: list[str], max_chars: int) -> list[str]:
    """Merge adjacent small pieces to avoid fragment chunks."""
    if not pieces:
        return []

    merged: list[str] = []
    buffer = pieces[0]

    for piece in pieces[1:]:
        candidate = f"{buffer}\n{piece}"
        if len(candidate) <= max_chars:
            buffer = candidate
        else:
            merged.append(buffer)
            buffer = piece

    merged.append(buffer)
    return merged
