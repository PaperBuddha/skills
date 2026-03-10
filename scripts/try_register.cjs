const axios = require('axios');
const { ethers } = require('ethers');
require('dotenv').config();

const API_BASE = 'https://api.a2amarket.live/v1';
const WALLET_KEY = process.env.A2A_MARKET_KEY;

if (!WALLET_KEY) {
  process.exit(1);
}

const wallet = new ethers.Wallet(WALLET_KEY);

async function tryRegister() {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  
  const headers = {
    'X-A2A-Wallet': wallet.address,
    'X-A2A-Timestamp': timestamp,
    'X-A2A-Signature': signature,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/sellers',
    '/agents',
    '/account/register',
    '/auth/register',
    '/register'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying POST ${endpoint}...`);
      const res = await axios.post(API_BASE + endpoint, { address: wallet.address }, { headers });
      console.log(`✅ Success ${endpoint}:`, res.data);
      return;
    } catch (err) {
      console.log(`❌ Failed ${endpoint}: ${err.response?.status}`);
    }
  }
  
  // Try without v1
  const API_BASE_ROOT = 'https://api.a2amarket.live';
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying POST (root) ${endpoint}...`);
      const res = await axios.post(API_BASE_ROOT + endpoint, { address: wallet.address }, { headers });
      console.log(`✅ Success (root) ${endpoint}:`, res.data);
      return;
    } catch (err) {
      console.log(`❌ Failed (root) ${endpoint}: ${err.response?.status}`);
    }
  }
}

tryRegister();
