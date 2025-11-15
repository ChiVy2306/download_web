# Use Node.js LTS
FROM node:20-slim

# Install Python, pip, ffmpeg and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --no-cache-dir yt-dlp --break-system-packages

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install Node dependencies
RUN npm install --production

# Copy backend code
COPY backend/ ./

# Create downloads directory
RUN mkdir -p downloads/videos

# Expose port
EXPOSE 3000

# Start both server and keep-alive
CMD ["npm", "start"]
