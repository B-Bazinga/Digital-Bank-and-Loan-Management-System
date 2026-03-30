# scripts/seed_data.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.security import hash_password
from app.core.config import settings
from app.schemas.user_schema import RoleEnum
from app.utils.helpers import generate_account_number

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    # ──────────────────────────────────────────────
    # 1. USERS — Admin, Employees, Customers
    # ──────────────────────────────────────────────
    users = [
        {
            "name": "Super Admin",
            "email": "admin@bank.com",
            "password": hash_password("admin123"),
            "role": RoleEnum.admin.value,
            "is_approved": True,
        },
        {
            "name": "Rahul Sharma",
            "email": "rahul@bank.com",
            "password": hash_password("employee123"),
            "role": RoleEnum.employee.value,
            "is_approved": True,  # Already approved by admin
        },
        {
            "name": "Priya Patel",
            "email": "priya@bank.com",
            "password": hash_password("employee123"),
            "role": RoleEnum.employee.value,
            "is_approved": False,  # Pending approval — good for testing admin approve flow
        },
        {
            "name": "Amit Kumar",
            "email": "amit@example.com",
            "password": hash_password("customer123"),
            "role": RoleEnum.customer.value,
        },
        {
            "name": "Sneha Gupta",
            "email": "sneha@example.com",
            "password": hash_password("customer123"),
            "role": RoleEnum.customer.value,
        },
        {
            "name": "Vikram Singh",
            "email": "vikram@example.com",
            "password": hash_password("customer123"),
            "role": RoleEnum.customer.value,
        },
    ]

    # Insert users (skip if email already exists)
    inserted_users = {}
    for user in users:
        existing = await db.users.find_one({"email": user["email"]})
        if not existing:
            result = await db.users.insert_one(user)
            inserted_users[user["email"]] = result.inserted_id
            print(f"  ✔ Created user: {user['name']} ({user['email']})")
        else:
            inserted_users[user["email"]] = existing["_id"]
            print(f"  — Skipped (exists): {user['email']}")

    # ──────────────────────────────────────────────
    # 2. ACCOUNTS — for the 3 customers
    # ──────────────────────────────────────────────
    accounts = [
        {
            "user_id": str(inserted_users["amit@example.com"]),
            "account_number": "1000000001",
            "balance": 50000.00,
            "status": "active",
        },
        {
            "user_id": str(inserted_users["sneha@example.com"]),
            "account_number": "1000000002",
            "balance": 75000.00,
            "status": "active",
        },
        {
            "user_id": str(inserted_users["vikram@example.com"]),
            "account_number": "1000000003",
            "balance": 30000.00,
            "status": "active",
        },
        {
            # Vikram's second account — frozen, good for testing frozen-account logic
            "user_id": str(inserted_users["vikram@example.com"]),
            "account_number": "1000000004",
            "balance": 10000.00,
            "status": "frozen",
        },
    ]

    for acc in accounts:
        existing = await db.accounts.find_one({"account_number": acc["account_number"]})
        if not existing:
            await db.accounts.insert_one(acc)
            print(f"  ✔ Created account: {acc['account_number']} (balance: ₹{acc['balance']}, status: {acc['status']})")
        else:
            print(f"  — Skipped (exists): account {acc['account_number']}")

    # ──────────────────────────────────────────────
    # 3. LOANS — mix of statuses
    # ──────────────────────────────────────────────
    loans = [
        {
            "user_id": str(inserted_users["amit@example.com"]),
            "amount": 200000.00,
            "status": "approved",
        },
        {
            "user_id": str(inserted_users["sneha@example.com"]),
            "amount": 500000.00,
            "status": "pending",  # Good for testing employee approval
        },
        {
            "user_id": str(inserted_users["vikram@example.com"]),
            "amount": 100000.00,
            "status": "rejected",
        },
    ]

    for loan in loans:
        existing = await db.loans.find_one(
            {
                "user_id": loan["user_id"],
                "amount": loan["amount"],
                "status": loan["status"],
            }
        )
        if not existing:
            await db.loans.insert_one(loan)
            print(
                f"  ✔ Created loan: user {loan['user_id']} amount ₹{loan['amount']} status {loan['status']}"
            )
        else:
            print(
                f"  — Skipped (exists): loan user {loan['user_id']} amount ₹{loan['amount']} status {loan['status']}"
            )

    # ──────────────────────────────────────────────
    # 4. TRANSACTIONS — some transfer history
    # ──────────────────────────────────────────────
    from datetime import datetime, timezone, timedelta

    transactions = [
        {
            "from_account": "1000000001",
            "to_account": "1000000002",
            "amount": 5000.00,
            "status": "success",
            "timestamp": datetime.now(timezone.utc) - timedelta(days=3),
        },
        {
            "from_account": "1000000002",
            "to_account": "1000000003",
            "amount": 12000.00,
            "status": "success",
            "timestamp": datetime.now(timezone.utc) - timedelta(days=2),
        },
        {
            "from_account": "1000000001",
            "to_account": "1000000003",
            "amount": 3000.00,
            "status": "success",
            "timestamp": datetime.now(timezone.utc) - timedelta(days=1),
        },
    ]

    for txn in transactions:
        existing = await db.transactions.find_one(
            {
                "from_account": txn["from_account"],
                "to_account": txn["to_account"],
                "amount": txn["amount"],
                "status": txn["status"],
            }
        )
        if not existing:
            await db.transactions.insert_one(txn)
            print(
                f"  ✔ Created transaction: {txn['from_account']} -> {txn['to_account']} ₹{txn['amount']}"
            )
        else:
            print(
                f"  — Skipped (exists): transaction {txn['from_account']} -> {txn['to_account']} ₹{txn['amount']}"
            )

    client.close()
    print("\n✅ Seed complete!")
    print("\n📋 Test credentials:")
    print("  Admin:      admin@bank.com / admin123")
    print("  Employee:   rahul@bank.com / employee123  (approved)")
    print("  Employee:   priya@bank.com / employee123  (NOT approved — test admin flow)")
    print("  Customer:   amit@example.com / customer123   (account: 1000000001, ₹50,000)")
    print("  Customer:   sneha@example.com / customer123  (account: 1000000002, ₹75,000)")
    print("  Customer:   vikram@example.com / customer123 (accounts: 1000000003 active, 1000000004 frozen)")

if __name__ == "__main__":
    asyncio.run(seed())