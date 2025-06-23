# Use a Node.js base image (includes npm/yarn)
FROM node:18-bookworm

# Install Python and backend dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    python3 -m pip install --upgrade pip

# Set up workspace directories
RUN mkdir -p /workspace/frontend /workspace/backend
WORKDIR /workspace

# Copy dependency files first (for better layer caching)
COPY frontend/package*.json ./frontend/
COPY backend/requirements.txt ./backend/

# Install frontend dependencies
RUN cd frontend && npm install

# Install backend dependencies
RUN cd backend && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install fastapi uvicorn supabase

# Copy remaining files (excludes are handled by .dockerignore)
COPY . .