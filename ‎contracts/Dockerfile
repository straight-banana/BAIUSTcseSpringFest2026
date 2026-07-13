# ─── Stage 1: Build & Base ───
FROM python:3.11-slim AS builder

# Set shell and environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# Install system dependencies needed for compiling python packages if any
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements to leverage Docker cache
COPY requirements.txt .

# Install dependencies into a wheels directory
RUN pip install --no-cache-dir -r requirements.txt


# ─── Stage 2: Final Runtime Image ───
FROM python:3.11-slim AS runner

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy project source code
COPY app/ ./app/
COPY run.py .

# Expose backend service port
EXPOSE 6767

# Run application
CMD ["python", "run.py"]
