require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Token cache to avoid unnecessary API calls
let tokenCache = {
  token: null,
  expiresAt: 0
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Tandem authentication server running',
    timestamp: new Date().toISOString()
  });
});

// Get Forge access token
app.get('/api/auth/token', async (req, res) => {
  try {
    // Check if cached token is still valid (with 5 min buffer)
    const now = Date.now();
    if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
      console.log('Returning cached token');
      return res.json({
        access_token: tokenCache.token,
        expires_in: Math.floor((tokenCache.expiresAt - now) / 1000)
      });
    }

    console.log('Fetching new token from Autodesk...');

    // Get new token from Autodesk
    const response = await axios.post(
      'https://developer.api.autodesk.com/authentication/v2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'data:read data:write'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        auth: {
          username: process.env.FORGE_CLIENT_ID,
          password: process.env.FORGE_CLIENT_SECRET
        }
      }
    );

    const { access_token, expires_in } = response.data;

    // Cache the token
    tokenCache = {
      token: access_token,
      expiresAt: now + (expires_in * 1000)
    };

    console.log('Token obtained successfully, expires in:', expires_in, 'seconds');

    res.json({
      access_token,
      expires_in
    });

  } catch (error) {
    console.error('Token error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to obtain access token',
      details: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Tandem Authentication Server                            ║
║   Running on: http://localhost:${PORT}                       ║
║   Health check: http://localhost:${PORT}/health              ║
║   Token endpoint: http://localhost:${PORT}/api/auth/token    ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
