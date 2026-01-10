# -----------------------------
# Base image
# -----------------------------
FROM python:3.11-slim

# -----------------------------
# Environment
# -----------------------------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# -----------------------------
# Working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# System dependencies (for psql/compilation)
# -----------------------------
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Install Python deps
# -----------------------------
COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Copy application code
# -----------------------------
COPY . .

# -----------------------------
# Ensure SQLite instance folder exists
# -----------------------------
RUN mkdir -p /app/instance

# -----------------------------
# Expose Flask port
# -----------------------------
EXPOSE 5000

# -----------------------------
# Start Gunicorn with good settings
# -----------------------------
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "--workers", "2", "--timeout", "120"]
