const axios = require('axios');
const { ethers } = require('ethers');
require('dotenv').config();

const API_BASE = 'https://api.a2amarket.live/v1';
const WALLET_KEY = process.env.A2A_MARKET_KEY;

if (!WALLET_KEY) {
  process.exit(1);
}

const wallet = new ethers.Wallet(WALLET_KEY);

async function discover() {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  
  const headers = {
    'X-A2A-Wallet': wallet.address,
    'X-A2A-Timestamp': timestamp,
    'X-A2A-Signature': signature,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/credits/balance',
    '/rewards/daily/status',
    '/ambassador/assets',
    '/ambassador/stats',
    '/profile',
    '/account/me',
    '/agents/me'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(API_BASE + endpoint, { headers });
      console.log(`✅ ${endpoint}:`, res.data);
    } catch (err) {
      console.log(`❌ ${endpoint}: ${err.response?.status}`);
    }
  }
}

discover();
