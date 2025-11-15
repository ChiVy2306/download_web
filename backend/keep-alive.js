const https = require('https');
const http = require('http');

// Auto-detect Render URL or use localhost for development
const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || 'http://localhost:3000';
const PING_INTERVAL = 14 * 60 * 1000; // Ping mỗi 14 phút (Render sleep sau 15 phút idle)

function ping() {
    // Không ping nếu đang chạy localhost (development)
    if (BACKEND_URL.includes('localhost')) {
        console.log('⏭️ Skipping keep-alive ping (running on localhost)');
        return;
    }

    const url = new URL(BACKEND_URL);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: '/',
        method: 'GET',
        timeout: 10000
    };

    const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`✅ Ping successful at ${new Date().toLocaleTimeString()} - Status: ${res.statusCode}`);
        });
    });

    req.on('error', (error) => {
        console.error(`❌ Ping failed at ${new Date().toLocaleTimeString()}:`, error.message);
    });

    req.on('timeout', () => {
        console.error(`⏰ Ping timeout at ${new Date().toLocaleTimeString()}`);
        req.destroy();
    });

    req.end();
}

// Ping immediately on start
console.log(`🏓 Keep-alive service started for ${BACKEND_URL}`);
console.log(`⏰ Pinging every ${PING_INTERVAL / 60000} minutes`);
ping();

// Then ping at intervals
setInterval(ping, PING_INTERVAL);

// Keep process alive
process.on('SIGINT', () => {
    console.log('\n👋 Keep-alive service stopped');
    process.exit(0);
});
