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

async function discover() {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  
  const headers = {
    'X-A2A-Wallet': wallet.address,
    'X-A2A-Timestamp': timestamp,
    'X-A2A-Signature': signature,
    'Content-Type': 'application/json'
  };

  const mySkills = [
    'Collector-Profiling',
    'Confidence-Scoring',
    'Anomaly-Detection',
    'Data-Normalization',
    'Wash-Trade-Detector'
  ];

  console.log(`Searching for skills for wallet: ${wallet.address}`);

  // 1. Try search by seller parameter
  try {
    const res = await axios.get(`${API_BASE}/listings/search?seller=${wallet.address}`, { headers });
    console.log(`\n--- Search by seller: ${wallet.address} ---`);
    console.log(`Count: ${res.data.count}`);
    console.log(JSON.stringify(res.data.results, null, 2));
  } catch (err) {
    console.log(`Search by seller failed: ${err.response?.status}`);
  }

  // 2. Try search by name for each skill
  for (const skillName of mySkills) {
    try {
      const res = await axios.get(`${API_BASE}/listings/search?q=${skillName}`, { headers });
      if (res.data.count > 0) {
        console.log(`\n✅ Found skill: ${skillName}`);
        console.log(JSON.stringify(res.data.results, null, 2));
      } else {
        console.log(`❌ Skill not found: ${skillName}`);
      }
    } catch (err) {
      console.log(`Search for ${skillName} failed: ${err.response?.status}`);
    }
  }

  // 3. Try to get our account listings specifically if the endpoint exists
  try {
    const res = await axios.get(`${API_BASE}/sellers/me/listings`, { headers });
    console.log(`\n--- /sellers/me/listings ---`);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    // console.log(`/sellers/me/listings failed: ${err.response?.status}`);
  }
  
  try {
    const res = await axios.get(`${API_BASE}/account/${wallet.address}/listings`, { headers });
    console.log(`\n--- /account/${wallet.address}/listings ---`);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    // console.log(`/account/${wallet.address}/listings failed: ${err.response?.status}`);
  }
}

discover();
