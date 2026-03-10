// polymarket_client.js
// Step 3 of Polymarket quickstart: Set Up Your Client
// Derives L2 API credentials from a wallet private key and initializes ClobClient.

import { ClobClient } from '@polymarket/clob-client';
import { Wallet } from 'ethers';

const HOST = 'https://clob.polymarket.com';
const CHAIN_ID = 137; // Polygon mainnet

async function buildClient() {
    const rawKey = process.env.WALLET_PRIVATE_KEY;
    if (!rawKey) {
        throw new Error('WALLET_PRIVATE_KEY environment variable is not set.');
    }

    // Normalize: strip whitespace/newlines, add 0x prefix if missing
    const trimmed = rawKey.trim();
    const privateKey = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;

    const signer = new Wallet(privateKey);

    // Step 1 — temporary unauthenticated client just to derive API creds
    const tempClient = new ClobClient(HOST, CHAIN_ID, signer);
    const creds = await tempClient.createOrDeriveApiKey();

    // Step 2 — fully initialized client with L2 creds
    // signatureType 0 = EOA (Externally Owned Account)
    const client = new ClobClient(HOST, CHAIN_ID, signer, creds, 0, signer.address);

    return client;
}

// Singleton promise so importers all share one initialized client
const clientPromise = buildClient();

export default clientPromise;

// ── Test (only runs when this file is executed directly) ─────────────────────
async function test() {
    console.log('Initializing Polymarket client...');
    const client = await clientPromise;
    const creds = client.creds;
    console.log('[PASS] ✅ API credentials derived successfully.');
    console.log(`  key:        ${creds.key}`);
    console.log(`  secret:     ${creds.secret}`);
    console.log(`  passphrase: ${creds.passphrase}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    test().catch(err => {
        console.error('[FAIL] 🛑', err.message);
        process.exit(1);
    });
}
