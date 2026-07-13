"""
SQLite database configuration and pre-seeding helper.
Parses rulebook_official.md and stores the parsed rules in a database table
for basic string matching search.
"""

from __future__ import annotations

import logging
import re
import sqlite3
from pathlib import Path

logger = logging.getLogger(__name__)

# Paths
_DB_PATH = Path(__file__).resolve().parent / "data" / "school_rules.db"
_RULEBOOK_PATH = Path(__file__).resolve().parent / "data" / "rulebook_official.md"


def get_db_connection() -> sqlite3.Connection:
    """Get a database connection with dictionary factory enabled."""
    conn = sqlite3.connect(_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create rules table and seed it with the contents of rulebook_official.md."""
    # Ensure database directory exists
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Create table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapter TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)
    conn.commit()

    # Check if table already contains data
    cursor.execute("SELECT COUNT(*) FROM rules")
    count = cursor.fetchone()[0]

    if count > 0:
        logger.info("Database table 'rules' is already seeded with %d entries.", count)
        conn.close()
        return

    # Seed table by parsing the rulebook markdown
    if not _RULEBOOK_PATH.exists():
        logger.error("Rulebook markdown file not found at %s. Cannot seed database.", _RULEBOOK_PATH)
        conn.close()
        return

    try:
        rules = parse_rulebook()
        if not rules:
            logger.warning("Parsed 0 rules from markdown. DB not seeded.")
            conn.close()
            return

        cursor.executemany(
            "INSERT INTO rules (chapter, title, content) VALUES (?, ?, ?)",
            [(r["chapter"], r["title"], r["content"]) for r in rules]
        )
        conn.commit()
        logger.info("Successfully seeded database table 'rules' with %d entries.", len(rules))

    except Exception:
        logger.exception("Error seeding database from rulebook")
    finally:
        conn.close()


def parse_rulebook() -> list[dict[str, str]]:
    """
    Parse rulebook_official.md into structured dict list using paragraph line-splitting.
    Matches Chapter headers and parses rule title and contents accurately.
    """
    content = _RULEBOOK_PATH.read_text(encoding="utf-8")
    
    # Normalise carriage returns
    content = content.replace("\r\n", "\n")
    
    # Split by blank lines to get paragraphs
    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    
    chapter_pattern = re.compile(r"^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+.*")
    
    rules: list[dict[str, str]] = []
    current_chapter = "General Guidelines"
    
    for p in paragraphs:
        lines = [l.strip() for l in p.split("\n") if l.strip()]
        if not lines:
            continue
            
        first_line = lines[0]
        if "OFFICIAL SCHOOL RULEBOOK" in first_line or "Effective immediately" in first_line:
            continue
            
        if chapter_pattern.match(first_line):
            current_chapter = first_line
            if len(lines) >= 3:
                title = lines[1]
                content_text = "\n".join(lines[2:])
                rules.append({
                    "chapter": current_chapter,
                    "title": title,
                    "content": content_text
                })
        else:
            if len(lines) >= 2:
                title = lines[0]
                content_text = "\n".join(lines[1:])
                rules.append({
                    "chapter": current_chapter,
                    "title": title,
                    "content": content_text
                })
                
    return rules
