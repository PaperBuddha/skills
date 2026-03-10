const axios = require('axios');
const { ethers } = require('ethers');
require('dotenv').config();

const API_BASE = 'https://api.a2amarket.live/v1';
const WALLET_KEY = process.env.A2A_MARKET_KEY;

if (!WALLET_KEY) {
  console.error("Missing A2A_MARKET_KEY");
  process.exit(1);
}

const wallet = new ethers.Wallet(WALLET_KEY);

async function testEndpoints() {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  
  const headers = {
    'X-A2A-Wallet': wallet.address,
    'X-A2A-Timestamp': timestamp,
    'X-A2A-Signature': signature,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/sellers/me',
    '/agents/me',
    '/auth/me',
    '/credits/balance',
    '/sellers/me/earnings'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const res = await axios.get(API_BASE + endpoint, { headers });
      console.log(`✅ Success ${endpoint}:`, res.data);
    } catch (err) {
      console.log(`❌ Failed ${endpoint}: ${err.response?.status} ${JSON.stringify(err.response?.data)}`);
    }
  }
}

testEndpoints();
