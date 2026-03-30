
class TestCreateAccount:
    # customer can create a new bank account.
    def test_create_account_as_customer(self, client, customer_headers):
        resp = client.post(
            "/api/accounts",
            json={"initial_deposit": 1000.0},
            headers=customer_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["balance"] == 1000.0
        assert data["status"] == "active"
        assert "account_number" in data
        assert len(data["account_number"]) == 10  

    # zero deposit should be allowed (ge=0).
    def test_create_account_zero_deposit(self, client, customer_headers):
        resp = client.post(
            "/api/accounts",
            json={"initial_deposit": 0},
            headers=customer_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["balance"] == 0

    # negative deposit should fail validation.
    def test_create_account_negative_deposit(self, client, customer_headers):
        resp = client.post(
            "/api/accounts",
            json={"initial_deposit": -500},
            headers=customer_headers,
        )
        assert resp.status_code == 422  

    # no token should return 401.
    def test_create_account_unauthenticated(self, client):
        resp = client.post(
            "/api/accounts",
            json={"initial_deposit": 1000.0},
        )
        assert resp.status_code == 401
