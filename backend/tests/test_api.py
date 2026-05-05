"""Basic API tests for MDE backend."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_analyze_too_short():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/analyze", json={"input": "짧음"})
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_analyze_too_long():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/analyze", json={"input": "a" * 501})
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_auth_me_unauthenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/auth/me")
    assert resp.status_code == 200
    assert resp.json()["user"] is None


@pytest.mark.asyncio
async def test_register_and_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 회원가입
        resp = await client.post("/api/auth/register", json={
            "email": "testuser@test.com",
            "password": "test1234"
        })
        assert resp.status_code == 201
        assert resp.json()["success"] is True

        # 로그인
        resp = await client.post("/api/auth/login", json={
            "email": "testuser@test.com",
            "password": "test1234"
        })
        assert resp.status_code == 200
        assert resp.json()["role"] == "user"


@pytest.mark.asyncio
async def test_image_analyze_invalid_mime():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/analyze/image", json={
            "mime_type": "application/pdf",
            "data": "abc123"
        })
    assert resp.status_code == 400
