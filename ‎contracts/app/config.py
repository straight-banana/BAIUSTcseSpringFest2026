"""
Application settings loaded from environment variables via pydantic-settings.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralised configuration — reads from .env at project root."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Embedding model (NVIDIA Nemotron) ──
    embedding_api_key: str
    embedding_base_url: str = "https://integrate.api.nvidia.com/v1"
    embedding_model: str = "nvidia/llama-nemotron-embed-vl-1b-v2"

    # ── Generation LLM (DiffusionGemma via NVIDIA) ──
    llm_api_key: str
    llm_base_url: str = "https://integrate.api.nvidia.com/v1"
    llm_model: str = "google/diffusiongemma-26b-a4b-it"

    # ── Redis ──
    redis_url: str = "redis://localhost:6379/0"

    # ── RAG tuning ──
    rag_top_k: int = 5
    chunk_size: int = 512
    chunk_overlap: int = 64


@lru_cache
def get_settings() -> Settings:
    """Singleton settings instance — cached after first call."""
    return Settings()
