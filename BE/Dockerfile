# Base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create necessary directories and set permissions
RUN mkdir -p /app/static/uploads /app/static/generated /app/templates \
    && chmod 777 /app/static/uploads /app/static/generated

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a non-root user and change ownership
RUN useradd -m myuser && \
    chown -R myuser:myuser /app
USER myuser

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["flask", "run", "--host=0.0.0.0"]