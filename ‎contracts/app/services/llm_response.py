"""
LLM client for google/diffusiongemma-26b-a4b-it via NVIDIA NIM.

Handles:
- Multimodal chat completions (text + images) via the OpenAI-compatible endpoint.
- JSON output parsing with validation.
- Redis caching of responses to save API costs.
"""

from __future__ import annotations

import hashlib
import json
import logging
from datetime import date
from typing import Any

import redis.asyncio as aioredis
from openai import AsyncOpenAI

from app.config import get_settings
from app.services.pdf_extractor import PageData
from app.services.prompts import (
    NO_RAG_CONTEXT,
    RAG_CONTEXT_BLOCK,
    STUDY_PLAN_SYSTEM_PROMPT,
    SUMMARIZE_SYSTEM_PROMPT,
    VERIFY_CLAIM_SYSTEM_PROMPT,
)

logger = logging.getLogger(__name__)

# ── Module-level singletons ──
_llm_client: AsyncOpenAI | None = None
_redis: aioredis.Redis | None = None

_CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours


def _get_llm_client() -> AsyncOpenAI:
    """Lazily initialised AsyncOpenAI client for the NVIDIA LLM endpoint."""
    global _llm_client
    if _llm_client is None:
        settings = get_settings()
        _llm_client = AsyncOpenAI(
            api_key=settings.llm_api_key,
            base_url=settings.llm_base_url,
        )
    return _llm_client


async def _get_redis() -> aioredis.Redis | None:
    """Lazily initialised Redis client. Returns None if Redis is unavailable."""
    global _redis
    if _redis is None:
        settings = get_settings()
        try:
            _redis = aioredis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=2,
            )
            await _redis.ping()
            logger.info("Redis cache connected.")
        except Exception:
            logger.warning("Redis unavailable — caching disabled.")
            _redis = None  # type: ignore[assignment]
    return _redis


def _cache_key(prefix: str, content: str) -> str:
    """Deterministic cache key from a prefix and content hash."""
    digest = hashlib.sha256(content.encode()).hexdigest()[:16]
    return f"syllabus:{prefix}:{digest}"


async def _check_cache(key: str) -> dict | None:
    """Return cached JSON response if it exists."""
    r = await _get_redis()
    if r is None:
        return None
    try:
        raw = await r.get(key)
        if raw:
            logger.debug("Cache hit: %s", key)
            return json.loads(raw)
    except Exception:
        logger.warning("Cache read failed for %s", key, exc_info=True)
    return None


async def _write_cache(key: str, data: dict) -> None:
    """Write a JSON response to cache."""
    r = await _get_redis()
    if r is None:
        return
    try:
        await r.set(key, json.dumps(data), ex=_CACHE_TTL_SECONDS)
    except Exception:
        logger.warning("Cache write failed for %s", key, exc_info=True)


def _build_page_image_content(pages: list[PageData]) -> list[dict]:
    """
    Build multimodal content blocks for the LLM from retrieved textbook pages.

    Each page becomes an image_url content block so DiffusionGemma
    (which is multimodal) can read the textbook page visually.
    """
    content_blocks: list[dict] = []

    content_blocks.append({
        "type": "text",
        "text": (
            "OFFICIAL TEXTBOOK PAGES (use these to validate and "
            "cross-reference topics from the syllabus):"
        ),
    })

    for page in pages:
        # Add a label for each page
        content_blocks.append({
            "type": "text",
            "text": f"[Textbook: {page.source}, Page {page.page_num + 1}]",
        })
        # Add the page image
        content_blocks.append({
            "type": "image_url",
            "image_url": {"url": page.base64_data_uri},
        })

    return content_blocks


# ═══════════════════════════════════════════════════════════════════════════════
# Public API
# ═══════════════════════════════════════════════════════════════════════════════


async def summarize_syllabus(
    syllabus_text: str,
    *,
    rag_pages: list[PageData] | None = None,
) -> dict[str, Any]:
    """
    Summarise a syllabus into a clean list of examinable topics.

    Parameters
    ----------
    syllabus_text:
        Raw syllabus pasted by the student.
    rag_pages:
        Optional list of retrieved textbook PageData objects.

    Returns
    -------
    dict with keys: "topics" (list[str]), "filtered_count" (int)
    """
    # Build cache key (hash syllabus + whether RAG is used, not the images)
    cache_content = syllabus_text + str(bool(rag_pages))
    cache_k = _cache_key("summarize", cache_content)

    cached = await _check_cache(cache_k)
    if cached:
        return cached

    # Build the RAG context indicator
    if rag_pages:
        rag_context = RAG_CONTEXT_BLOCK.format(
            curriculum_chunks=(
                "See the attached textbook page images below. "
                "Cross-reference the syllabus against these pages."
            )
        )
    else:
        rag_context = NO_RAG_CONTEXT

    system_prompt = SUMMARIZE_SYSTEM_PROMPT.format(rag_context=rag_context)

    result = await _call_llm(
        system_prompt=system_prompt,
        user_message=f"Syllabus text to analyse:\n\n{syllabus_text}",
        page_images=rag_pages,
    )

    await _write_cache(cache_k, result)
    return result


async def generate_study_plan(
    topics: list[str],
    *,
    test_date: date,
    hours_per_day: float,
    rag_pages: list[PageData] | None = None,
) -> dict[str, Any]:
    """
    Generate a time-blocked study plan from a list of topics.

    Parameters
    ----------
    topics:
        Filtered examinable topics (output of summarize_syllabus).
    test_date:
        Exam date.
    hours_per_day:
        Available daily study hours.
    rag_pages:
        Optional textbook page images for difficulty estimation.

    Returns
    -------
    dict with keys: "plan" (list), "total_topics" (int), "total_study_hours" (float)
    """
    today = date.today()
    days_remaining = (test_date - today).days

    if days_remaining <= 0:
        return {
            "plan": [],
            "total_topics": len(topics),
            "total_study_hours": 0,
            "error": "Test date must be in the future.",
        }

    cache_content = json.dumps(topics) + str(test_date) + str(hours_per_day)
    cache_k = _cache_key("studyplan", cache_content)

    cached = await _check_cache(cache_k)
    if cached:
        return cached

    # Build RAG context
    if rag_pages:
        rag_context = RAG_CONTEXT_BLOCK.format(
            curriculum_chunks=(
                "See the attached textbook page images below. "
                "Use them to estimate topic difficulty and suggest subtopic breakdowns."
            )
        )
    else:
        rag_context = NO_RAG_CONTEXT

    system_prompt = STUDY_PLAN_SYSTEM_PROMPT.format(
        rag_context=rag_context,
        today=today.isoformat(),
        test_date=test_date.isoformat(),
        days_remaining=days_remaining,
        hours_per_day=hours_per_day,
        topics_json=json.dumps(topics),
    )

    result = await _call_llm(
        system_prompt=system_prompt,
        user_message=(
            f"Generate a study plan for the following {len(topics)} topics. "
            f"The exam is in {days_remaining} days and I can study "
            f"{hours_per_day} hours per day."
        ),
        page_images=rag_pages,
    )

    await _write_cache(cache_k, result)
    return result


async def verify_claim(
    claim: str,
    rules: list[Any],
) -> dict[str, Any]:
    """
    Verify a claim against relevant school rules using DiffusionGemma.
    
    Parameters
    ----------
    claim:
        The claim to fact-check.
    rules:
        List of RulebookChunk or matched rules.
    """
    cache_content = claim + str([r.text if hasattr(r, "text") else r.get("content", "") for r in rules])
    cache_k = _cache_key("verify", cache_content)

    cached = await _check_cache(cache_k)
    if cached:
        return cached

    # Format rules context
    rule_texts = []
    for r in rules:
        if hasattr(r, "text"):
            rule_texts.append(r.text)
        else:
            rule_texts.append(f"[{r.get('chapter', '')}] Rule: {r.get('title', '')}. Content: {r.get('content', '')}")
            
    rule_context = "\n\n".join(rule_texts) if rule_texts else "No official rules match this claim."

    system_prompt = VERIFY_CLAIM_SYSTEM_PROMPT.format(rule_context=rule_context)

    result = await _call_llm(
        system_prompt=system_prompt,
        user_message=f"Claim to verify: {claim}",
    )

    await _write_cache(cache_k, result)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# Private helpers
# ═══════════════════════════════════════════════════════════════════════════════


async def _call_llm(
    *,
    system_prompt: str,
    user_message: str,
    page_images: list[PageData] | None = None,
    max_tokens: int = 4096,
    temperature: float = 0.3,
) -> dict[str, Any]:
    """
    Call the DiffusionGemma LLM via NVIDIA's OpenAI-compatible endpoint.

    If page_images are provided, sends a multimodal message with both
    text and image content blocks.
    """
    settings = get_settings()
    client = _get_llm_client()

    # Build the user message content
    if page_images:
        # Multimodal: text + image content blocks
        user_content: list[dict] | str = [
            {"type": "text", "text": user_message},
        ]
        user_content.extend(_build_page_image_content(page_images))
    else:
        # Text-only
        user_content = user_message

    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        max_tokens=max_tokens,
        temperature=temperature,
    )

    raw_content = response.choices[0].message.content or ""

    # Strip markdown fences if the LLM wraps JSON in ```json ... ```
    cleaned = raw_content.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("LLM returned non-JSON response. Wrapping as fallback.")
        return {
            "raw_response": raw_content,
            "error": "LLM did not return valid JSON. Raw response included.",
        }
