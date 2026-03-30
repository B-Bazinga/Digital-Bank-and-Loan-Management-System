
class TestApplyLoan:
    def test_apply_loan_as_customer(self, client, customer_headers):
        resp = client.post(
            "/api/loans/apply",
            json={"amount": 50000.0},
            headers=customer_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["amount"] == 50000.0
        assert data["status"] == "pending"
        assert "user_id" in data

    def test_apply_loan_zero_amount(self, client, customer_headers):
        resp = client.post(
            "/api/loans/apply",
            json={"amount": 0},
            headers=customer_headers,
        )
        assert resp.status_code == 422

    def test_apply_loan_as_employee_forbidden(self, client, employee_headers):
        resp = client.post(
            "/api/loans/apply",
            json={"amount": 10000.0},
            headers=employee_headers,
        )
        assert resp.status_code == 403

    def test_apply_loan_unauthenticated(self, client):
        resp = client.post("/api/loans/apply", json={"amount": 1000.0})
        assert resp.status_code == 401


class TestViewLoans:
    def test_view_loans_as_customer(self, client, customer_headers):
        resp = client.get("/api/loans", headers=customer_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_view_loans_as_employee(self, client, employee_headers):
        resp = client.get("/api/loans", headers=employee_headers)
        assert resp.status_code == 200

    def test_view_loans_as_admin(self, client, admin_headers):
        resp = client.get("/api/loans", headers=admin_headers)
        assert resp.status_code == 200

    def test_view_loans_unauthenticated(self, client):
        resp = client.get("/api/loans")
        assert resp.status_code == 401


class TestApproveLoan:
    def test_approve_loan_as_employee(self, client, customer_headers, employee_headers):
        # First, create a loan as customer
        create_resp = client.post(
            "/api/loans/apply",
            json={"amount": 25000.0},
            headers=customer_headers,
        )
        assert create_resp.status_code == 200
        loan_id = create_resp.json()["_id"]

        # Now approve it as employee
        resp = client.put(
            f"/api/loans/{loan_id}/approve",
            headers=employee_headers,
        )
        assert resp.status_code == 200
        assert "approved" in resp.json()["message"].lower()

    def test_approve_loan_as_admin(self, client, customer_headers, admin_headers):
        create_resp = client.post(
            "/api/loans/apply",
            json={"amount": 15000.0},
            headers=customer_headers,
        )
        loan_id = create_resp.json()["_id"]

        resp = client.put(
            f"/api/loans/{loan_id}/approve",
            headers=admin_headers,
        )
        assert resp.status_code == 200

    def test_approve_loan_as_customer_forbidden(self, client, customer_headers):
        fake_id = "000000000000000000000000"
        resp = client.put(
            f"/api/loans/{fake_id}/approve",
            headers=customer_headers,
        )
        assert resp.status_code == 403

    def test_approve_nonexistent_loan(self, client, employee_headers):
        fake_id = "000000000000000000000000"
        resp = client.put(
            f"/api/loans/{fake_id}/approve",
            headers=employee_headers,
        )
        assert resp.status_code == 404
