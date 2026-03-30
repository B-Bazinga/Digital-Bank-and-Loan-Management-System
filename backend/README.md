# Digital Banking and Loan Management System - Backend

FastAPI backend for a digital banking platform with authentication, user roles, accounts, transactions, loans, admin workflows, MongoDB, and Redis.

## Tech Stack

- FastAPI
- MongoDB (Motor)
- Redis
- Pydantic Settings
- JWT Authentication
- Docker + Docker Compose
- Pytest + HTTPX

## Prerequisites

Choose one of the setup paths below.

### For Local Setup

- Python 3.12+
- uv package manager
- MongoDB running on port 27017
- Redis running on port 6379

If uv is not installed yet:

```bash
pip install uv
```

### For Docker Setup

- Docker
- Docker Compose

## Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Update values in .env as needed:

```env
PROJECT_NAME="Digital Banking API"
MONGODB_URL="mongodb://localhost:27017"
DATABASE_NAME="digital_banking"
REDIS_URL="redis://localhost:6379"
SECRET_KEY="your-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Notes:
- For local development, use localhost URLs.
- For Docker Compose, the app uses service names (mongodb://mongo:27017 and redis://redis:6379) from docker-compose.yml.

## Option 1: Run Locally (without Docker)

1. Create and activate virtual environment:

```bash
uv venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```powershell
uv venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```bash
uv pip install -r requirements.txt
```

3. Start the API:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. Open:

- API root: http://localhost:8000/
- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Option 2: Run with Docker Compose (recommended)

1. Start all services:

```bash
docker compose up --build
```

2. API will be available at:

- http://localhost:8000/
- http://localhost:8000/docs

3. Stop services:

```bash
docker compose down
```

4. Stop services and remove database volume:

```bash
docker compose down -v
```

## Seed Test Data

After MongoDB and Redis are running, seed demo data:

```bash
uv run python -m app.scripts.seed_data
```

This creates sample admin, employee, customer users, accounts, loans, and transactions.

Default seeded credentials:
- Admin: admin@bank.com / admin123
- Employee (approved): rahul@bank.com / employee123
- Employee (pending): priya@bank.com / employee123
- Customer: amit@example.com / customer123

## Run Tests

Tests are integration-style and expect the API to be running at http://localhost:8000.

1. Start the app (locally or via Docker Compose).
2. Seed data (recommended before first run).
3. Run tests:

```bash
uv run pytest -v
```

Run tests from inside the running backend container:

```bash
docker compose exec backend pytest -v
```

## Project Structure

```text
app/
  api/            # Route definitions
  controllers/    # HTTP-level request handlers
  services/       # Business logic
  repositories/   # Data access logic
  models/         # Database models
  schemas/        # Request/response schemas
  core/           # Config, DB, security, dependencies
  middleware/     # Logging, rate limiting
  exceptions/     # Error classes and handlers
  scripts/        # Utility scripts (seed data)
tests/            # Integration tests
```

## Common Commands

```bash
# Run API locally
uv run uvicorn app.main:app --reload

# Run tests
uv run pytest -v

# Build and run docker services
docker compose up --build

# Stop docker services
docker compose down
```

## Troubleshooting

- If app startup fails, verify MongoDB and Redis are reachable via the URLs in .env.
- If login tests fail, run the seed script before testing.
- If port 8000 is busy, stop the existing process or change the mapped port.

### MongoDB Atlas Authentication Failed

If you see `AtlasError: bad auth : Authentication failed`:

1. Verify `.env` contains a valid `MONGODB_URI` (or `MONGODB_URL`).
2. Confirm Atlas Database User credentials are correct.
3. URL-encode special characters in the password (`@` -> `%40`, `#` -> `%23`, `/` -> `%2F`).
4. In Atlas Network Access, allow your current IP.
5. Ensure the database user has read/write privileges for the target database.

Example:

```env
MONGODB_URI="mongodb+srv://dbuser:MyP%40ss%232024@cluster0.xxxxx.mongodb.net/digital_banking?retryWrites=true&w=majority"
DATABASE_NAME="digital_banking"
```
