FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if any needed
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy local risk-engine package
COPY packages/risk-engine /packages/risk-engine

# Copy api dependencies and install
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Install risk-engine locally
RUN pip install --no-cache-dir -e /packages/risk-engine

# Copy api code
COPY apps/api /app

# Run healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
