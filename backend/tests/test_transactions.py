
class TestTransfer:
    def test_transfer_success(self, client, customer_headers):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={
                "to_account": "1000000002",
                "amount": 100.0,
            },
            headers=customer_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["from_account"] == "1000000001"
        assert data["to_account"] == "1000000002"
        assert data["amount"] == 100.0
        assert data["status"] == "success"

    def test_transfer_insufficient_funds(self, client, customer_headers):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={
                "to_account": "1000000002",
                "amount": 99999999.0,  # Way more than the account has
            },
            headers=customer_headers,
        )
        assert resp.status_code == 400
        assert "insufficient" in resp.json().get("message", "").lower()

    def test_transfer_to_frozen_account(self, client, customer_headers):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={
                "to_account": "1000000004",  # Vikram's frozen account
                "amount": 50.0,
            },
            headers=customer_headers,
        )
        assert resp.status_code == 400
        assert "frozen" in resp.json().get("message", "").lower()

    def test_transfer_nonexistent_account(self, client, customer_headers):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={
                "to_account": "9999999999",
                "amount": 10.0,
            },
            headers=customer_headers,
        )
        assert resp.status_code == 404

    def test_transfer_negative_amount(self, client, customer_headers):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={
                "to_account": "1000000002",
                "amount": -100.0,
            },
            headers=customer_headers,
        )
        assert resp.status_code == 422

    def test_transfer_unauthenticated(self, client):
        resp = client.post(
            "/api/transactions/transfer",
            params={"from_account_num": "1000000001"},
            json={"to_account": "1000000002", "amount": 10.0},
        )
        assert resp.status_code == 401
