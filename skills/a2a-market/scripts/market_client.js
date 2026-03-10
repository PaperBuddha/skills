const axios = require('axios');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_BASE = 'https://api.a2amarket.live';
const WALLET_KEY = process.env.A2A_MARKET_KEY;
const SNAPSHOT_PATH = path.join(__dirname, '../../../memory/a2a_snapshot.json');

if (!WALLET_KEY) {
  console.error("CRITICAL SECURITY ERROR: A2A_MARKET_KEY environment variable is missing.");
  process.exit(1);
}

// Initialize Wallet - Local only, never transmitted
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org"); // Base L2
const wallet = new ethers.Wallet(WALLET_KEY, provider);

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000
});

// Request Interceptor to sign headers if needed
client.interceptors.request.use(async (config) => {
  const timestamp = Date.now().toString();
  const signature = await wallet.signMessage(`a2a-auth:${timestamp}`);
  config.headers['X-A2A-Wallet'] = wallet.address;
  config.headers['X-A2A-Timestamp'] = timestamp;
  config.headers['X-A2A-Signature'] = signature;
  config.headers['x-agent-id'] = wallet.address; // Use wallet address as Agent ID fallback
  return config;
});

async function handleX402(error) {
  if (error.response && error.response.status === 402) {
    console.log("⚠️  402 Payment Required. Processing payment...");
    const paymentReq = error.response.data.payment_request; // { to, amount, currency, chainId }
    
    // Security Check: Max Transaction Limit (5 USDC)
    // Assuming 6 decimals for USDC
    const MAX_AMOUNT = 5 * 1000000; 
    if (paymentReq.amount > MAX_AMOUNT) {
      throw new Error(`Security Halt: Transaction amount ${paymentReq.amount} exceeds 5.00 USDC limit.`);
    }

    // In a real implementation, we would construct and sign the tx here
    // const tx = await wallet.sendTransaction({ ... });
    // return client.request({ ...originalRequest, headers: { 'X-A2A-Tx-Hash': tx.hash } });
    
    console.log(`[MOCK] Signed transaction of ${paymentReq.amount} to ${paymentReq.to}`);
    return "PAYMENT_SENT_MOCK"; 
  }
  throw error;
}

async function registerSeller() {
  try {
    const res = await client.post('/sellers', { address: wallet.address });
    console.log("✅ Seller Registered:", res.data);
  } catch (err) {
    console.error("Registration Failed:", err.message);
  }
}

async function checkEarnings() {
  try {
    const res = await client.get('/v1/credits/balance');
    console.log("💰 Earnings Report:");
    console.table(res.data);
    
    // Save snapshot on success
    try {
      if (!fs.existsSync(path.dirname(SNAPSHOT_PATH))) {
        fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
      }
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(res.data, null, 2));
    } catch (saveErr) {
      console.warn("⚠️  Failed to save earnings snapshot:", saveErr.message);
    }
  } catch (err) {
    console.error("Earnings Check Failed:", err.message);
    
    // Fallback to snapshot
    if (fs.existsSync(SNAPSHOT_PATH)) {
      console.warn("⚠️  A2A API Offline/Migrating. Loading last known snapshot...");
      try {
        const cachedData = JSON.parse(fs.readFileSync(SNAPSHOT_PATH));
        console.table(cachedData);
      } catch (loadErr) {
        console.error("❌ Failed to load cached snapshot:", loadErr.message);
      }
    }
  }
}

async function main() {
  const command = process.argv[2];
  
  switch(command) {
    case 'register':
      await registerSeller();
      break;
    case 'earnings':
      await checkEarnings();
      break;
    default:
      console.log("Usage: node market_client.js [register|earnings|list|buy]");
  }
}

main();
