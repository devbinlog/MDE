"""Pytest configuration for MDE backend tests."""
import asyncio
import os
import pytest

# Test environment — must be set before app imports
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
os.environ.setdefault("JWT_SECRET", "test_secret_for_pytest_only")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("JWT_EXPIRE_DAYS", "1")
os.environ.setdefault("ADMIN_EMAIL", "admin@mde.dev")
os.environ.setdefault("ADMIN_PASSWORD", "test_admin")
os.environ.setdefault("LLM_PROVIDER", "gemini")
os.environ.setdefault("LLM_MODEL", "gemini-2.0-flash")
os.environ.setdefault("LLM_API_KEY", "test_key_not_used_in_unit_tests")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")

from app.core.database import create_tables


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """Create a fresh DB before all tests, clean up after."""
    # Remove stale test DB from previous runs
    if os.path.exists("test.db"):
        os.remove("test.db")
    asyncio.run(create_tables())
    yield
    if os.path.exists("test.db"):
        os.remove("test.db")
