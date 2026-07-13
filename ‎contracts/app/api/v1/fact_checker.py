"""
API endpoints for fact-checking and rulebook verification.
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.schemas.fact_check import (
    RuleResponse,
    SearchRequest,
    VerifyRequest,
    VerifyResponse,
)
from app.services.embedder import embed_single
from app.services.llm_response import verify_claim
from app.services.rulebook_service import get_rulebook_store, search_rules_by_string

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/fact-check", tags=["Fact Checker"])


@router.post(
    "/search",
    response_model=list[RuleResponse],
    status_code=status.HTTP_200_OK,
    summary="Query guidelines using basic string matching",
    description="Searches pre-seeded database table of official school rules using SQL LIKE query against title and content.",
)
async def search_endpoint(body: SearchRequest) -> list[RuleResponse]:
    try:
        results = search_rules_by_string(body.query)
        return [
            RuleResponse(
                id=r["id"],
                chapter=r["chapter"],
                title=r["title"],
                content=r["content"],
            )
            for r in results
        ]
    except Exception as exc:
        logger.exception("Error in fact-check /search endpoint")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal database search error: {exc}",
        ) from exc


@router.post(
    "/verify",
    response_model=VerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Semantic fact-checking verify endpoint",
    description="Embeds the claim, performs cosine-similarity search against rulebook pages, and validates using DiffusionGemma.",
)
async def verify_endpoint(body: VerifyRequest) -> VerifyResponse:
    store = get_rulebook_store()

    # Load rulebook if not loaded yet
    if not store.is_loaded:
        try:
            await store.load_rulebook()
        except Exception:
            logger.warning("Failed to load rulebook in verify endpoint", exc_info=True)

    if not store.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Official School Rulebook store is not initialized.",
        )

    try:
        # Step 1: Embed query claim
        query_embedding = await embed_single(body.claim, input_type="query")

        # Step 2: Retrieve semantically matching rules (Top-3)
        matching_chunks = await store.retrieve(query_embedding, top_k=3)

        # Step 3: Map chunks to database entries to get IDs
        # Search DB for these rules to return official ID and format matching_rules
        matched_rules = []
        for chunk in matching_chunks:
            # Query DB for this rule by title (exact match)
            from app.db import get_db_connection
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, chapter, title, content FROM rules WHERE title = ?", (chunk.title,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                matched_rules.append(RuleResponse(
                    id=row["id"],
                    chapter=row["chapter"],
                    title=row["title"],
                    content=row["content"]
                ))
            else:
                matched_rules.append(RuleResponse(
                    id=999,  # fallback ID
                    chapter=chunk.chapter,
                    title=chunk.title,
                    content=chunk.content
                ))

        # Step 4: Evaluate with large LLM
        eval_result = await verify_claim(body.claim, matching_chunks)

        if "error" in eval_result and "status" not in eval_result:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LLM evaluation failed: {eval_result.get('error')}",
            )

        # Output styled validation response
        return VerifyResponse(
            status=eval_result.get("status", "[FALSE]"),
            confidence_score=float(eval_result.get("confidence_score", 0.5)),
            exact_quote=eval_result.get("exact_quote", ""),
            explanation=eval_result.get("explanation", "Verification completed."),
            matched_rules=matched_rules,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error in fact-check /verify endpoint")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification server error: {exc}",
        ) from exc
