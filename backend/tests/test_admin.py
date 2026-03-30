
import uuid

class TestAdminCustomers:
    def test_view_customers_as_admin(self, client, admin_headers):
        resp = client.get("/api/admin/customers", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= 3  
        for customer in data:
            assert "password" not in customer
            assert customer["role"] == "customer"

    def test_view_customers_as_customer_forbidden(self, client, customer_headers):
        resp = client.get("/api/admin/customers", headers=customer_headers)
        assert resp.status_code == 403

    def test_view_customers_as_employee_forbidden(self, client, employee_headers):
        resp = client.get("/api/admin/customers", headers=employee_headers)
        assert resp.status_code == 403

    def test_view_customers_unauthenticated(self, client):
        resp = client.get("/api/admin/customers")
        assert resp.status_code == 401


class TestApproveEmployee:
    def test_approve_employee_as_admin(self, client, admin_headers):
        email = f"emp_{uuid.uuid4().hex[:6]}@bank.com"
        reg_resp = client.post(
            "/api/auth/register",
            json={
                "name": "Test Employee",
                "email": email,
                "password": "emp123456",
                "role": "employee",
            },
        )
        assert reg_resp.status_code == 200
        employee_id = reg_resp.json()["_id"]

        resp = client.put(
            f"/api/admin/employees/{employee_id}/approve",
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert "approved" in resp.json()["message"].lower()

    def test_approve_nonexistent_employee(self, client, admin_headers):
        fake_id = "000000000000000000000000"
        resp = client.put(
            f"/api/admin/employees/{fake_id}/approve",
            headers=admin_headers,
        )
        assert resp.status_code == 404

    def test_approve_employee_as_customer_forbidden(self, client, customer_headers):
        fake_id = "000000000000000000000000"
        resp = client.put(
            f"/api/admin/employees/{fake_id}/approve",
            headers=customer_headers,
        )
        assert resp.status_code == 403
