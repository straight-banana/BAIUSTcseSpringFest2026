"""
FastAPI application entry point.

- Lifespan handler loads curriculum embeddings on startup.
- CORS middleware enabled for frontend integration.
- Health check at /health.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import syllabus_router, fact_check_router
from app.db import init_db
from app.services.retriever import get_curriculum_store
from app.services.rulebook_service import get_rulebook_store

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-7s │ %(name)s │ %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.

    Startup : Initializes rules database and launches a background task
              to load and cache textbook and rulebook embeddings.
    """
    logger.info("🚀 Starting Kuddus Syllabus Shortener & compliance engine...")

    # 1. Initialize SQLite Database & seed rules table
    try:
        init_db()
    except Exception:
        logger.exception("⚠️ Failed to initialize rules database.")

    # 2. Launch background loader
    import asyncio
    store = get_curriculum_store()
    rulebook_store = get_rulebook_store()
    
    async def load_in_background():
        # Load rulebook first (very fast, usually 1s with cache)
        try:
            await rulebook_store.load_rulebook()
            logger.info("✅ Official rulebook loaded in background.")
        except Exception:
            logger.warning("⚠️ Failed to load rulebook in background.", exc_info=True)

        # Then load textbook PDFs
        try:
            await store.load_from_pdfs()
            if store.is_loaded:
                logger.info(
                    "✅ Textbooks background loading finished: %d pages indexed.", len(store.pages)
                )
            else:
                logger.warning(
                    "⚠️  No textbook PDFs found in background loader."
                )
        except Exception:
            logger.warning(
                "⚠️  Failed to load textbook embeddings in background.",
                exc_info=True,
            )

    # Launch background task and yield immediately to start server
    asyncio.create_task(load_in_background())

    yield

    logger.info("👋 Shutting down.")


app = FastAPI(
    title="Kuddus Syllabus Shortener",
    description=(
        "Backend API that takes a professor's verbose syllabus, filters it "
        "via RAG against official curriculum, and generates structured study plans."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS (allow frontend on any origin during development) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ──
app.include_router(syllabus_router)
app.include_router(fact_check_router)


# ── Health check ──
@app.get("/health", tags=["System"])
async def health_check():
    store = get_curriculum_store()
    return {
        "status": "healthy",
        "curriculum_loaded": store.is_loaded,
        "curriculum_pages": len(store.pages) if store.is_loaded else 0,
    }
