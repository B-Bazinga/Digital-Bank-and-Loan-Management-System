
import uuid

class TestRegister:
    # POST /api/auth/register — should create a new customer.
    def test_register_new_user(self, client):
        unique_email = f"testuser_{uuid.uuid4().hex[:8]}@test.com"
        resp = client.post(
            "/api/auth/register",
            json={
                "name": "Test User",    
                "email": unique_email,
                "password": "testpass123",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == unique_email
        assert data["name"] == "Test User"
        assert data["role"] == "customer"
        # Password should NOT be in the response
        assert "password" not in data

    # POST /api/auth/register — duplicate email should be rejected.
    def test_register_duplicate_email(self, client):
        resp = client.post(
            "/api/auth/register",
            json={
                "name": "Duplicate",
                "email": "admin@bank.com",  # already exists from seed
                "password": "whatever123",
            },
        )
        assert resp.status_code == 400
        assert "already registered" in resp.json().get("message", "").lower()

    # POST /api/auth/register — password too short should fail validation.
    def test_register_short_password(self, client):
        resp = client.post(
            "/api/auth/register",
            json={
                "name": "Short Pass",
                "email": f"short_{uuid.uuid4().hex[:6]}@test.com",
                "password": "123",  # less than min_length=6
            },
        )
        assert resp.status_code == 422  


class TestLogin:
    # POST /api/auth/login — valid credentials should return a token.
    def test_login_success(self, client):
        resp = client.post(
            "/api/auth/login",
            data={"username": "admin@bank.com", "password": "admin123"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    # POST /api/auth/login — wrong password should return 401.
    def test_login_wrong_password(self, client):
        resp = client.post(
            "/api/auth/login",
            data={"username": "admin@bank.com", "password": "wrongpassword"},
        )
        assert resp.status_code == 401

    # POST /api/auth/login — unknown email should return 401.
    def test_login_nonexistent_user(self, client):
        resp = client.post(
            "/api/auth/login",
            data={"username": "nobody@nowhere.com", "password": "pass123"},
        )
        assert resp.status_code == 401

    # POST /api/auth/login — unapproved employee can get a token
    def test_login_unapproved_employee(self, client):
        resp = client.post(
            "/api/auth/login",
            data={"username": "priya@bank.com", "password": "employee123"},
        )
        # Login itself succeeds (token is issued)
        assert resp.status_code == 200
        token = resp.json()["access_token"]

        # But accessing a protected route should fail with 403
        resp2 = client.get(
            "/api/loans",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp2.status_code == 403
        assert "pending" in resp2.json().get("message", "").lower()
