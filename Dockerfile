FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TZ=Asia/Kolkata

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/instance
VOLUME ["/app/instance"]

EXPOSE 5000

# Use $PORT environment variable (required for Cloud Run)
CMD gunicorn app:app -b 0.0.0.0:$PORT --workers 2 --timeout 120 --access-logfile -
