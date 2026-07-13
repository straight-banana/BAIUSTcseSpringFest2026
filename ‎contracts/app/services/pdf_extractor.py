"""
PDF text extraction and page rendering service using PyMuPDF.

Since the textbook PDFs are image-based (no extractable text layer),
we render pages to JPEG images and encode them as base64 data URIs.
These are used for:
1. Multimodal embeddings via nvidia/llama-nemotron-embed-vl-1b-v2
2. Visual context for the LLM (DiffusionGemma is multimodal)
"""

from __future__ import annotations

import base64
import logging
from dataclasses import dataclass
from pathlib import Path

import pymupdf

logger = logging.getLogger(__name__)

# ── Path to the book PDFs directory ──
_BOOK_PDF_DIR = Path(__file__).resolve().parent.parent / "data" / "book_pdfs"

# ── Rendering config ──
_RENDER_DPI = 100  # Balance between quality and payload size
_JPEG_QUALITY = 75  # JPEG compression quality


@dataclass
class PageData:
    """A single PDF page rendered as a base64 image with optional text."""

    page_num: int
    source: str
    base64_data_uri: str  # "data:image/jpeg;base64,..."
    text: str  # Extracted text (may be empty for image-based PDFs)

    @property
    def has_text(self) -> bool:
        return len(self.text.strip()) > 30


def render_pdf_pages(pdf_path: Path, *, dpi: int = _RENDER_DPI) -> list[PageData]:
    """
    Render all pages of a PDF to base64 JPEG images.

    Also attempts text extraction — if the PDF has a text layer, it's included.
    For image-based PDFs, text will be empty but the image is always available.
    """
    pages: list[PageData] = []
    source = pdf_path.stem

    try:
        doc = pymupdf.open(str(pdf_path))

        for page_num in range(len(doc)):
            page = doc[page_num]

            # Render page to JPEG image
            pix = page.get_pixmap(dpi=dpi)
            img_bytes = pix.tobytes("jpeg")
            b64 = base64.b64encode(img_bytes).decode()
            data_uri = f"data:image/jpeg;base64,{b64}"

            # Also try text extraction (will be empty for image-based PDFs)
            text = page.get_text("text").strip()

            pages.append(
                PageData(
                    page_num=page_num,
                    source=source,
                    base64_data_uri=data_uri,
                    text=text,
                )
            )

        doc.close()

        text_pages = sum(1 for p in pages if p.has_text)
        logger.info(
            "Rendered %s: %d pages (%d with text)",
            pdf_path.name,
            len(pages),
            text_pages,
        )

    except Exception:
        logger.error("Failed to process %s", pdf_path.name, exc_info=True)

    return pages


def load_all_pdfs(directory: Path | None = None) -> dict[str, list[PageData]]:
    """
    Load and render all PDFs in the given directory.

    Returns
    -------
    dict mapping filename (stem) → list of PageData.
    """
    pdf_dir = directory or _BOOK_PDF_DIR

    if not pdf_dir.exists():
        logger.warning("PDF directory not found: %s", pdf_dir)
        return {}

    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        logger.warning("No PDF files found in %s", pdf_dir)
        return {}

    results: dict[str, list[PageData]] = {}
    for pdf_path in pdf_files:
        pages = render_pdf_pages(pdf_path)
        if pages:
            results[pdf_path.stem] = pages

    total_pages = sum(len(p) for p in results.values())
    logger.info(
        "Loaded %d PDFs (%d total pages) from %s",
        len(results),
        total_pages,
        pdf_dir.name,
    )
    return results


def load_pdf_by_name(
    name: str,
    directory: Path | None = None,
) -> list[PageData] | None:
    """
    Load a specific PDF by its filename stem (e.g. "English_compressed").

    Returns list of PageData or None if not found.
    """
    pdf_dir = directory or _BOOK_PDF_DIR

    for pdf_path in pdf_dir.glob("*.pdf"):
        if pdf_path.stem == name or pdf_path.stem.lower() == name.lower():
            return render_pdf_pages(pdf_path)

    logger.warning("PDF not found: %s in %s", name, pdf_dir)
    return None
