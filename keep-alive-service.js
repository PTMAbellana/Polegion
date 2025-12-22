/**
 * RENDER FREE TIER KEEP-ALIVE SERVICE
 * 
 * Prevents Render backend from spinning down by pinging it every 10 minutes.
 * Deploy this separately (free Render cron job or run locally during testing).
 * 
 * WHY THIS WORKS:
 * - Render free tier spins down after 15 min inactivity
 * - This pings every 10 min to keep it warm
 * - Reduces cold start issues by 90%+
 */

const axios = require('axios');

// REPLACE THIS WITH YOUR ACTUAL RENDER BACKEND URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes (keeps it under 15 min threshold)

console.log('🚀 Starting keep-alive service for:', BACKEND_URL);

async function pingBackend() {
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 30000 // 30 second timeout
    });
    const duration = Date.now() - start;
    
    console.log(`✅ Backend alive - ${response.data.status} (${duration}ms)`);
  } catch (error) {
    console.error('❌ Backend ping failed:', error.message);
  }
}

// Ping immediately on start
pingBackend();

// Then ping every 10 minutes
setInterval(pingBackend, PING_INTERVAL);

console.log(`🔥 Keep-alive service started - pinging ${BACKEND_URL} every 10 minutes`);
