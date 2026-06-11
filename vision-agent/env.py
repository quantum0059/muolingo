from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent
REPO_ROOT = ROOT_DIR.parent


def load_env() -> None:
    """Load parent repo .env and map names used by the Expo app."""
    load_dotenv(REPO_ROOT / ".env", override=False)
    load_dotenv(ROOT_DIR / ".env", override=False)

    if not os.getenv("STREAM_API_SECRET") and os.getenv("STREAM_SECRET_KEY"):
        os.environ["STREAM_API_SECRET"] = os.environ["STREAM_SECRET_KEY"]

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and not os.getenv("GOOGLE_API_KEY"):
        os.environ["GOOGLE_API_KEY"] = gemini_key


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value
