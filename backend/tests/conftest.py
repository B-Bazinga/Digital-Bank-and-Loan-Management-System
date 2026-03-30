# tests/conftest.py
"""
Shared fixtures for all integration tests.
Tests run against the live Docker Compose services (mongo, redis, backend).
"""

import pytest
import httpx

BASE_URL = "http://localhost:8000"


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def client():
    """Synchronous HTTPX client scoped to the entire test session."""
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        yield c


# ─── Helper to get a JWT token ───────────────────────────────────


def _login(client: httpx.Client, email: str, password: str) -> str:
    """Login and return a Bearer token string."""
    resp = client.post(
        "/api/auth/login",
        data={"username": email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed for {email}: {resp.text}"
    return resp.json()["access_token"]


def _auth_header(token: str) -> dict:
    """Return an Authorization header dict."""
    return {"Authorization": f"Bearer {token}"}


# ─── Role-based token fixtures ───────────────────────────────────


@pytest.fixture(scope="session")
def admin_token(client):
    return _login(client, "admin@bank.com", "admin123")


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return _auth_header(admin_token)


@pytest.fixture(scope="session")
def employee_token(client):
    return _login(client, "rahul@bank.com", "employee123")


@pytest.fixture(scope="session")
def employee_headers(employee_token):
    return _auth_header(employee_token)


@pytest.fixture(scope="session")
def customer_token(client):
    return _login(client, "amit@example.com", "customer123")


@pytest.fixture(scope="session")
def customer_headers(customer_token):
    return _auth_header(customer_token)
