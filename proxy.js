const express = require('express');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
app.use(express.json());

const servers = process.env.BACKEND_SERVERS.split(',');

// Load balancing logic (round-robin)
let currentIndex = 0;

function getTargetServer() {
  const server = servers[currentIndex];
  currentIndex = (currentIndex + 1) % servers.length;
  return server;
}

// Proxy middleware
app.use(
  '/api/data',
  proxy(getTargetServer, {
    proxyReqPathResolver: (req) => req.originalUrl,
    userResDecorator: (proxyRes, proxyResData) => {
      console.log('Response from backend:', proxyResData.toString('utf8'));
      return proxyResData;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy failed to route request' });
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start the proxy server
const PORT = process.env.PROXY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reverse proxy running on port ${PORT}`);
});
