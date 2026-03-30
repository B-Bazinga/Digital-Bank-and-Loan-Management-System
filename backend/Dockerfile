# 1. Use a modern, lightweight Python image
FROM python:3.12-slim

# 2. Set environment variables for optimal Python behavior in Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Install `uv` directly from the official image (Best practice for Docker)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 5. Copy ONLY the requirements file first
COPY requirements.txt .

# 6. Install dependencies using uv into the system Python environment
RUN uv pip install --system -r requirements.txt

# 7. Copy the rest of your application code
COPY . .

# 8. Create a non-root user for security best practices
RUN useradd -m myappuser && chown -R myappuser:myappuser /app
USER myappuser

# 9. Expose the port FastAPI will run on
EXPOSE 8000

# 10. Start the server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]