"""Pytest configuration for MDE backend tests."""
import os
import pytest

# Test environment settings
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
