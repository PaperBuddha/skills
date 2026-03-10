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

async function findId() {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  
  const headers = {
    'X-A2A-Wallet': wallet.address,
    'X-A2A-Timestamp': timestamp,
    'X-A2A-Signature': signature,
    'Content-Type': 'application/json'
  };

  // 1. Try to get profile
  try {
    const res = await axios.get(`${API_BASE}/profile`, { headers });
    console.log("Profile Data:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("Profile Failed:", err.response?.status);
  }

  // 2. Try to search for our wallet on the leaderboard to find the UUID
  try {
    const res = await axios.get(`${API_BASE}/credits/leaderboard?limit=100`);
    const me = res.data.leaderboard.find(a => a.walletAddress.toLowerCase() === wallet.address.toLowerCase());
    if (me) {
      console.log("Found in Leaderboard:", JSON.stringify(me, null, 2));
    } else {
      console.log("Not found in top 100 leaderboard.");
    }
  } catch (err) {
    console.log("Leaderboard Search Failed:", err.message);
  }
}

findId();
