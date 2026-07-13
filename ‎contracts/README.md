# antikudus-mission03-mission06
Sub services for anti-kudus protocol
<<<<<<< HEAD

## Overview
`contracts/app` is a FastAPI backend that provides two core academic services:
- Syllabus summarization and study-plan generation using multimodal RAG.
- School rulebook lookup and claim verification using a combined SQLite + semantic search pipeline.

The app is designed around NVIDIA embeddings and the DiffusionGemma LLM, with cached PDF page embeddings and official rulebook metadata.

## Repository layout
- `app/main.py` — FastAPI application setup, CORS, routers, and startup lifecycle.
- `app/config.py` — Pydantic settings loader for NVIDIA API keys, Redis, and model endpoints.
- `app/db.py` — SQLite rulebook initialization, markdown parsing, and seeding.
- `run.py` — Uvicorn entrypoint for local development.
- `app/api/v1/` — HTTP routes for syllabus and fact-check endpoints.
- `app/schemas/` — Pydantic request/response models.
- `app/services/` — business logic for embeddings, PDF extraction, retrieval, prompts, and LLM coordination.
- `app/data/` — textbook PDFs, rulebook markdown, SQLite DB, and cached embeddings.
- `images/` — architecture and data-flow diagrams used to illustrate the service.

## App architecture
1. Startup
   - `app/db.py:init_db()` creates `rules` table and seeds it from `app/data/rulebook_official.md`.
   - `app/main.py` starts background loaders for curriculum PDF embeddings and rulebook embeddings.

2. Curriculum RAG pipeline
   - `app/services/pdf_extractor.py` renders `app/data/book_pdfs/*.pdf` into JPEG `PageData` objects.
   - `app/services/embedder.py` embeds page images and query text via `nvidia/llama-nemotron-embed-vl-1b-v2`.
   - `app/services/retriever.py` stores curriculum page embeddings in memory and retrieves top-K similar pages.
   - `app/services/llm_response.py` builds multimodal prompts and calls DiffusionGemma for summaries or study plans.

3. Fact-check pipeline
   - `app/services/rulebook_service.py` parses `rulebook_official.md` into rule chunks and caches semantic embeddings.
   - `app/db.py` provides SQL-backed title/content search for quick rule lookup.
   - `app/api/v1/fact_checker.py` verifies claims by combining semantic matches with LLM evaluation.

## API summary
### Syllabus endpoints
- `POST /api/v1/syllabus/summarize`
  - Request: `SyllabusRequest` (`syllabus_text`, optional `course_id`)
  - Response: `SummarizeResponse` (`topics`, `filtered_count`, `rag_context_used`)

- `POST /api/v1/syllabus/study-plan`
  - Request: `StudyPlanRequest` (`syllabus_text`, `test_date`, `hours_per_day`, optional `course_id`)
  - Response: `StudyPlanResponse` with structured study blocks.

### Fact-check endpoints
- `POST /api/v1/fact-check/search`
  - Request: `SearchRequest` (`query`)
  - Response: list of `RuleResponse` rows from the SQLite rulebook.

- `POST /api/v1/fact-check/verify`
  - Request: `VerifyRequest` (`claim`)
  - Response: `VerifyResponse` with status, confidence, quote, explanation, and matched rules.

## Data stores
- `app/data/rulebook_official.md` — official school rules source.
- `app/data/school_rules.db` — SQLite rulebook table used for text-search queries.
- `app/data/book_pdfs/` — curriculum PDFs rendered and indexed for RAG.
- `app/data/.cache/` — cached page embeddings and rulebook embedding state.

## Image references
These visuals illustrate the architecture and data flow for the contract app:

- ![RAG-Based Syllabus Shortener](images/WhatsApp%20Image%202026-07-12%20at%2011.36.17%20AM.jpeg)
- ![Textbook Indexing Flow](images/WhatsApp%20Image%202026-07-12%20at%207.43.25%20PM.jpeg)
- ![Rulebook Fact-Check Flow](images/WhatsApp%20Image%202026-07-12%20at%207.44.03%20PM.jpeg)
- ![Additional Architecture Diagram](images/WhatsApp%20Image%202026-07-12%20at%207.48.53%20PM.jpeg)

## How to run
1. Install dependencies from `requirements.txt`.
2. Create a `.env` file with `embedding_api_key`, `llm_api_key`, `redis_url`, and other settings.
3. Start the app with:
   ```bash
   python run.py
   ```
4. Health check is available at `/health`.

## Notes
- The app uses a multimodal retrieval flow where textbook pages are embedded as images.
- LLM prompts are defined in `app/services/prompts.py` and enforce JSON-only responses.
- Redis is optional and used for caching expensive LLM responses.
=======
>>>>>>> 501f3db5c2601d8ffabc2b07f7427bd167c202a6
