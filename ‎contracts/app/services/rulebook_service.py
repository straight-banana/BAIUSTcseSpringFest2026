"""
Rulebook services:
1. SQL-based keyword search (basic string-matching guidelines table).
2. Semantic Search retriever (RulebookStore) using Nemotron VL embeddings.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
import pickle
import sqlite3
from pathlib import Path

import numpy as np

from app.db import get_db_connection
from app.services.embedder import embed_texts
from app.services.pdf_extractor import PageData  # using standard placeholder if needed

logger = logging.getLogger(__name__)

# Paths
_RULEBOOK_PATH = Path(__file__).resolve().parent.parent / "data" / "rulebook_official.md"
_CACHE_PATH = Path(__file__).resolve().parent.parent / "data" / ".cache" / "rulebook_cache.pkl"


def search_rules_by_string(query: str) -> list[dict]:
    """
    Search guidelines in the SQLite rules table using basic string-matching (SQL LIKE).
    Matches against both title and content columns.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Pre-process search term for LIKE syntax
    search_term = f"%{query}%"
    
    cursor.execute("""
        SELECT id, chapter, title, content
        FROM rules
        WHERE title LIKE ? OR content LIKE ?
    """, (search_term, search_term))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


class RulebookChunk:
    """A single rule chunk containing chapter, title, content, and the formatted text."""
    
    def __init__(self, chapter: str, title: str, content: str):
        self.chapter = chapter
        self.title = title
        self.content = content
        # Formatted text used for embedding representation
        self.text = f"[{chapter}] Rule: {title}. Content: {content}"


class RulebookStore:
    """
    In-memory semantic search index for the official school rulebook.
    
    Builds or loads embeddings of the rulebook and runs cosine similarity
    against incoming fact-check claims.
    """

    def __init__(self) -> None:
        self.chunks: list[RulebookChunk] = []
        self.embeddings: np.ndarray = np.empty((0, 0))
        self._is_loaded: bool = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded and len(self.chunks) > 0

    async def load_rulebook(self) -> None:
        """
        Load rulebook markdown, chunk it, and compute or load embeddings.
        Uses MD5 hash of the rulebook to check for updates.
        """
        if not _RULEBOOK_PATH.exists():
            logger.warning("Rulebook markdown file not found at %s. Semantic search disabled.", _RULEBOOK_PATH)
            return

        # Compute hash
        def _get_hash():
            with open(_RULEBOOK_PATH, "rb") as f:
                return hashlib.md5(f.read()).hexdigest()
        
        rulebook_hash = await asyncio.to_thread(_get_hash)

        # Check local cache first
        _CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        if _CACHE_PATH.exists():
            try:
                def _load_cache():
                    with open(_CACHE_PATH, "rb") as f:
                        return pickle.load(f)
                
                cache_data = await asyncio.to_thread(_load_cache)
                if cache_data.get("hash") == rulebook_hash:
                    self.chunks = cache_data["chunks"]
                    self.embeddings = cache_data["embeddings"]
                    self._is_loaded = True
                    logger.info("Successfully loaded rulebook embeddings from cache.")
                    return
            except Exception:
                logger.warning("Failed to load rulebook cache. Re-embedding...", exc_info=True)

        # Parse rulebook markdown to chunks
        from app.db import parse_rulebook
        logger.info("Cache miss for rulebook. Parsing and generating embeddings...")
        
        parsed_rules = await asyncio.to_thread(parse_rulebook)
        if not parsed_rules:
            logger.warning("Failed to parse rulebook. 0 entries extracted.")
            return

        chunks = [
            RulebookChunk(r["chapter"], r["title"], r["content"])
            for r in parsed_rules
        ]

        # Embed chunk texts using Nemotron (input_type="passage" for indexing)
        chunk_texts = [c.text for c in chunks]
        embeddings = await embed_texts(chunk_texts, input_type="passage")

        self.chunks = chunks
        self.embeddings = embeddings
        self._is_loaded = True

        # Save cache
        try:
            cache_data = {
                "hash": rulebook_hash,
                "chunks": chunks,
                "embeddings": embeddings
            }
            def _save_cache():
                with open(_CACHE_PATH, "wb") as f:
                    pickle.dump(cache_data, f)
            
            await asyncio.to_thread(_save_cache)
            logger.info("Saved rulebook cache to disk.")
        except Exception:
            logger.warning("Failed to write rulebook cache.", exc_info=True)

    async def retrieve(self, query_embedding: np.ndarray, top_k: int = 3) -> list[RulebookChunk]:
        """Retrieve the top-K rules most semantically similar to the query embedding."""
        if not self.is_loaded:
            return []

        # Cosine similarity
        query_norm = query_embedding / (np.linalg.norm(query_embedding) + 1e-10)
        corpus_norms = self.embeddings / (
            np.linalg.norm(self.embeddings, axis=1, keepdims=True) + 1e-10
        )
        similarities = corpus_norms @ query_norm

        top_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            results.append(self.chunks[idx])
        
        return results


# ── Module-level singleton ──
_store: RulebookStore | None = None


def get_rulebook_store() -> RulebookStore:
    """Return global RulebookStore singleton."""
    global _store
    if _store is None:
        _store = RulebookStore()
    return _store
