"""
In-memory RAG retriever — replaces a vector database.

On application startup, textbook PDFs are rendered page-by-page to JPEG
images, each page image is embedded via the multimodal Nemotron model,
and stored as numpy arrays.

At query time, the syllabus text is embedded and cosine similarity is
computed against the stored page embeddings to find the most relevant
textbook pages.

For a few textbooks (~500 pages total), in-memory numpy is fast and
perfectly sufficient without needing a vector DB.
"""

from __future__ import annotations

import asyncio
import logging
from pathlib import Path

import numpy as np

from app.services.embedder import embed_texts
from app.services.pdf_extractor import PageData, load_all_pdfs, load_pdf_by_name

logger = logging.getLogger(__name__)

# ── Batch size for embedding API calls ──
_EMBED_BATCH_SIZE = 8  # Smaller batches for image payloads (larger than text)


class CurriculumStore:
    """
    Holds pre-computed multimodal embeddings for textbook pages.

    Each page is rendered to a JPEG image and embedded by the
    nvidia/llama-nemotron-embed-vl-1b-v2 vision-language model.
    """

    def __init__(self) -> None:
        self.pages: list[PageData] = []
        self.embeddings: np.ndarray = np.empty((0, 0))
        self._is_loaded: bool = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded and len(self.pages) > 0

    async def load_from_pdfs(self, book_name: str | None = None) -> None:
        """
        Load textbook PDFs, render pages to images, and compute
        multimodal embeddings. Uses local disk caching (MD5-based)
        to prevent re-embedding on startup.

        If *book_name* is given (e.g. "English_compressed"), only that PDF
        is loaded. Otherwise, all PDFs in app/data/book_pdfs/ are loaded.
        """
        import hashlib
        import pickle

        pdf_dir = Path(__file__).resolve().parent.parent / "data" / "book_pdfs"
        cache_dir = Path(__file__).resolve().parent.parent / "data" / ".cache"
        cache_dir.mkdir(parents=True, exist_ok=True)

        # Discover PDF paths
        if book_name:
            pdf_paths = [p for p in pdf_dir.glob("*.pdf") if p.stem == book_name or p.stem.lower() == book_name.lower()]
        else:
            pdf_paths = sorted(pdf_dir.glob("*.pdf"))

        if not pdf_paths:
            logger.warning("No PDF files found to process.")
            return

        all_pages: list[PageData] = []
        all_embeddings_list: list[np.ndarray] = []

        for pdf_path in pdf_paths:
            # 1. Compute MD5 hash of PDF to detect changes (non-blocking)
            def _compute_hash(path):
                with open(path, "rb") as f:
                    return hashlib.md5(f.read()).hexdigest()
            
            pdf_hash = await asyncio.to_thread(_compute_hash, pdf_path)
            cache_file = cache_dir / f"{pdf_path.stem}_{pdf_hash}.pkl"

            # 2. Check if cache exists (non-blocking)
            if cache_file.exists():
                try:
                    logger.info("Loading cached embeddings for %s...", pdf_path.name)
                    def _load_cache(path):
                        with open(path, "rb") as f:
                            return pickle.load(f)
                    cache_data = await asyncio.to_thread(_load_cache, cache_file)
                    
                    all_pages.extend(cache_data["pages"])
                    all_embeddings_list.append(cache_data["embeddings"])
                    logger.info("Successfully loaded %s from cache.", pdf_path.name)
                    
                    # Update store state incrementally so cached books are immediately available
                    self.embeddings = np.vstack(all_embeddings_list)
                    self.pages = list(all_pages)
                    self._is_loaded = True
                    continue
                except Exception:
                    logger.warning("Cache file %s corrupted. Re-embedding...", cache_file.name, exc_info=True)

            # 3. Process PDF if no cache hit (non-blocking PDF rendering)
            logger.info("Cache miss for %s. Rendering and embedding pages...", pdf_path.name)
            pages = await asyncio.to_thread(load_pdf_by_name, pdf_path.stem)
            if not pages:
                continue

            # Embed page images in batches using the multimodal model
            logger.info("Embedding %d page images for %s in batches of %d...", len(pages), pdf_path.name, _EMBED_BATCH_SIZE)
            pdf_embeddings: list[np.ndarray] = []
            
            for i in range(0, len(pages), _EMBED_BATCH_SIZE):
                batch = pages[i : i + _EMBED_BATCH_SIZE]
                batch_inputs = [p.base64_data_uri for p in batch]
                batch_embeddings = await embed_texts(batch_inputs, input_type="passage")
                pdf_embeddings.append(batch_embeddings)
                logger.info(
                    "  Embedded batch %d/%d (%d pages)",
                    (i // _EMBED_BATCH_SIZE) + 1,
                    (len(pages) + _EMBED_BATCH_SIZE - 1) // _EMBED_BATCH_SIZE,
                    len(batch),
                )

            stacked_embeddings = np.vstack(pdf_embeddings)

            # Save to cache (non-blocking write)
            try:
                cache_data = {
                    "pages": pages,
                    "embeddings": stacked_embeddings
                }
                def _save_cache(path, data):
                    with open(path, "wb") as f:
                        pickle.dump(data, f)
                await asyncio.to_thread(_save_cache, cache_file, cache_data)
                logger.info("Saved cache for %s.", pdf_path.name)
            except Exception:
                logger.warning("Failed to save cache for %s", pdf_path.name, exc_info=True)

            all_pages.extend(pages)
            all_embeddings_list.append(stacked_embeddings)

            # Update store state incrementally (thread-safe copy) so cached books are immediately available
            self.embeddings = np.vstack(all_embeddings_list)
            self.pages = list(all_pages)
            self._is_loaded = True

        if not all_pages:
            logger.warning("No PDF pages loaded.")
            return

        logger.info(
            "CurriculumStore background load complete: %d pages indexed.",
            len(self.pages),
        )

    async def retrieve(
        self,
        query_embedding: np.ndarray,
        top_k: int = 5,
    ) -> list[PageData]:
        """
        Find the *top_k* most similar textbook pages to the query embedding
        using cosine similarity.
        """
        if not self.is_loaded:
            return []

        # Cosine similarity: dot(q, E^T) / (||q|| * ||E||)
        query_norm = query_embedding / (np.linalg.norm(query_embedding) + 1e-10)
        corpus_norms = self.embeddings / (
            np.linalg.norm(self.embeddings, axis=1, keepdims=True) + 1e-10
        )
        similarities = corpus_norms @ query_norm

        # Get top-k indices (highest similarity first)
        top_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            page = self.pages[idx]
            results.append(page)
            logger.debug(
                "  Retrieved page %d from %s (score=%.4f)",
                page.page_num,
                page.source,
                float(similarities[idx]),
            )

        return results


# ── Module-level singleton ──
_store: CurriculumStore | None = None


def get_curriculum_store() -> CurriculumStore:
    """Return the global CurriculumStore singleton."""
    global _store
    if _store is None:
        _store = CurriculumStore()
    return _store
