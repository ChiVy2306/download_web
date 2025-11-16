# Use Node.js LTS
FROM node:20-slim

# Install Python, pip, ffmpeg and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    wget \
    curl \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Cloudflare WARP
RUN curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/cloudflare-client.list && \
    apt-get update && \
    apt-get install -y cloudflare-warp && \
    rm -rf /var/lib/apt/lists/*

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

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 3000

# Start with WARP and server
CMD ["/start.sh"]
