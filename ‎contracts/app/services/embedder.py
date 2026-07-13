"""
NVIDIA embedding API client for llama-nemotron-embed-vl-1b-v2.

Supports both text and image (base64 data URI) inputs.
The model is multimodal — it can embed document page images directly,
which is critical for image-based PDFs with no extractable text.
"""

from __future__ import annotations

import logging
from typing import Literal

import numpy as np
from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)

# Module-level client — initialised lazily
_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    """Return a singleton AsyncOpenAI client pointed at the NVIDIA embedding endpoint."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = AsyncOpenAI(
            api_key=settings.embedding_api_key,
            base_url=settings.embedding_base_url,
        )
    return _client


async def embed_texts(
    texts: list[str],
    *,
    input_type: Literal["query", "passage"] = "passage",
) -> np.ndarray:
    """
    Generate embeddings for a batch of text or image inputs.

    Parameters
    ----------
    texts:
        List of text strings OR base64 data URIs (data:image/jpeg;base64,...).
        The NVIDIA API accepts both formats in the same input array.
    input_type:
        "passage" when indexing documents, "query" when embedding a search query.

    Returns
    -------
    np.ndarray of shape (len(texts), embedding_dim)
    """
    if not texts:
        return np.empty((0, 0))

    settings = get_settings()
    client = _get_client()

    response = await client.embeddings.create(
        model=settings.embedding_model,
        input=texts,
        extra_body={"input_type": input_type},
    )

    # Sort by index to guarantee order matches input
    sorted_data = sorted(response.data, key=lambda d: d.index)
    embeddings = np.array([d.embedding for d in sorted_data], dtype=np.float32)

    logger.debug(
        "Embedded %d inputs → shape %s (input_type=%s)",
        len(texts),
        embeddings.shape,
        input_type,
    )
    return embeddings


async def embed_single(
    text: str,
    *,
    input_type: Literal["query", "passage"] = "query",
) -> np.ndarray:
    """Convenience wrapper — embed a single text/image, return 1-D vector."""
    result = await embed_texts([text], input_type=input_type)
    return result[0]
