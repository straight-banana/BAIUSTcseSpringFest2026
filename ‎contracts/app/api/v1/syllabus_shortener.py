"""
Syllabus Shortener API — v1 routes.

Two endpoints under one router:
  POST /api/v1/syllabus/summarize   → RAG-filtered topic extraction
  POST /api/v1/syllabus/study-plan  → RAG-filtered study plan generation

RAG pipeline:
  1. Embed syllabus text as a query vector.
  2. Cosine-similarity search against pre-embedded textbook page images.
  3. Pass the matching page images to the multimodal LLM as visual context.
"""

from __future__ import annotations

import logging
from datetime import date

from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.schemas.syllabus import (
    StudyPlanRequest,
    StudyPlanResponse,
    SummarizeResponse,
    SyllabusRequest,
)
from app.services.embedder import embed_single
from app.services.llm_response import generate_study_plan, summarize_syllabus
from app.services.pdf_extractor import PageData
from app.services.retriever import get_curriculum_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/syllabus", tags=["Syllabus"])


# ═══════════════════════════════════════════════════════════════════════════════
# Shared RAG pipeline
# ═══════════════════════════════════════════════════════════════════════════════


async def _run_rag_pipeline(
    syllabus_text: str,
    course_id: str | None = None,
) -> list[PageData]:
    """
    Execute the multimodal RAG pipeline:
    1. Embed the syllabus text as a query.
    2. Retrieve the most relevant textbook pages via cosine similarity.
    3. Return the matching PageData objects (containing base64 images).

    Returns an empty list if no textbook data is loaded.
    """
    store = get_curriculum_store()

    # If a specific book was requested but not yet loaded, load it now
    if course_id and not store.is_loaded:
        try:
            await store.load_from_pdfs(book_name=course_id)
        except Exception:
            logger.warning(
                "Failed to load textbook for course_id=%s",
                course_id,
                exc_info=True,
            )

    if not store.is_loaded:
        return []

    settings = get_settings()

    # Embed the full syllabus text as a single query vector
    query_embedding = await embed_single(syllabus_text, input_type="query")

    # Retrieve top-K most relevant textbook pages
    results = await store.retrieve(query_embedding, top_k=settings.rag_top_k)

    logger.info(
        "RAG retrieved %d pages from textbooks.",
        len(results),
    )
    return results


# ═══════════════════════════════════════════════════════════════════════════════
# Endpoint 1: Summarize
# ═══════════════════════════════════════════════════════════════════════════════


@router.post(
    "/summarize",
    response_model=SummarizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarise a syllabus into examinable topics",
    description=(
        "Accepts raw syllabus text, uses multimodal RAG to cross-reference "
        "against textbook page images, and returns a clean bulleted list of "
        "topics with non-examinable noise filtered out."
    ),
)
async def summarize_endpoint(body: SyllabusRequest) -> SummarizeResponse:
    try:
        # Step 1–2: RAG retrieval (returns page images)
        rag_pages = await _run_rag_pipeline(body.syllabus_text, body.course_id)

        # Step 3: LLM summarisation with page images as visual context
        result = await summarize_syllabus(
            body.syllabus_text,
            rag_pages=rag_pages if rag_pages else None,
        )

        if "error" in result and "topics" not in result:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LLM returned an error: {result.get('error')}",
            )

        return SummarizeResponse(
            topics=result.get("topics", []),
            filtered_count=result.get("filtered_count", 0),
            rag_context_used=bool(rag_pages),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error in /summarize")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {exc}",
        ) from exc


# ═══════════════════════════════════════════════════════════════════════════════
# Endpoint 2: Study Plan
# ═══════════════════════════════════════════════════════════════════════════════


@router.post(
    "/study-plan",
    response_model=StudyPlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a time-blocked study plan",
    description=(
        "Takes syllabus text, a test date, and daily study hours. First "
        "summarises topics via multimodal RAG, then generates a structured "
        "JSON study plan that maps filtered topics into a countdown schedule."
    ),
)
async def study_plan_endpoint(body: StudyPlanRequest) -> StudyPlanResponse:
    # Validate test date
    days_until = (body.test_date - date.today()).days
    if days_until <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="test_date must be in the future.",
        )

    try:
        # Step 1–2: RAG retrieval (page images)
        rag_pages = await _run_rag_pipeline(body.syllabus_text, body.course_id)

        # Step 3: First summarise to get clean topics
        summary_result = await summarize_syllabus(
            body.syllabus_text,
            rag_pages=rag_pages if rag_pages else None,
        )
        topics = summary_result.get("topics", [])

        if not topics:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract any topics from the syllabus text.",
            )

        # Step 4: Generate study plan from clean topics
        plan_result = await generate_study_plan(
            topics,
            test_date=body.test_date,
            hours_per_day=body.hours_per_day,
            rag_pages=rag_pages if rag_pages else None,
        )

        if "error" in plan_result and "plan" not in plan_result:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LLM returned an error: {plan_result.get('error')}",
            )

        return StudyPlanResponse(
            plan=plan_result.get("plan", []),
            total_topics=plan_result.get("total_topics", len(topics)),
            total_study_hours=plan_result.get("total_study_hours", 0),
            days_until_test=days_until,
            rag_context_used=bool(rag_pages),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error in /study-plan")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {exc}",
        ) from exc
