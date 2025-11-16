#!/bin/bash

# Start WARP daemon
echo "🔧 Starting WARP daemon..."
warp-svc &
sleep 3

# Register and connect WARP
echo "📡 Registering WARP..."
warp-cli register || echo "Already registered"

echo "🌐 Connecting to WARP..."
warp-cli connect || echo "Already connected"

# Wait for WARP to be fully connected
sleep 5

# Check WARP status
echo "✅ WARP Status:"
warp-cli status || echo "WARP status check failed"

# Set proxy for all requests
export https_proxy=socks5://127.0.0.1:40000
export http_proxy=socks5://127.0.0.1:40000

echo "🚀 Starting application..."
npm start
