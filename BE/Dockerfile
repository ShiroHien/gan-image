# Base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 for the Flask app
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the application
CMD ["flask", "run"]

# FROM python:3.9-slim
# WORKDIR /app
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     libgl1 \
#     libglib2.0-0 \
#     git \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*
# COPY . /app
# RUN pip install --no-cache-dir -r requirements.txt
# EXPOSE 5000
# ENV FLASK_APP=app.py
# ENV FLASK_RUN_HOST=0.0.0.0
# CMD ["flask", "run"]


