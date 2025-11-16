#!/bin/bash
set -e

echo "🔧 Starting D-Bus daemon (required by WARP)..."
mkdir -p /var/run/dbus
dbus-daemon --system --fork || echo "D-Bus already running"
sleep 2

# Start WARP daemon
echo "🔧 Starting WARP daemon..."
warp-svc &
sleep 8

# Register and connect WARP
echo "📡 Registering WARP..."
# Auto-accept ToS using environment variable
yes | warp-cli registration new || echo "Already registered"
sleep 2

echo "🌐 Connecting to WARP..."
warp-cli connect || echo "Already connected"

# Wait for WARP to be fully connected
sleep 10

# Check WARP status
echo "✅ WARP Status:"
warp-cli status || echo "WARP status check failed"

# Set proxy for all requests
export https_proxy=socks5://127.0.0.1:40000
export http_proxy=socks5://127.0.0.1:40000

echo "🚀 Proxy configured: $https_proxy"
echo "🚀 Starting application..."
exec npm start
