// verify_systems.js
// A definitive test script to verify wallet balances on the Polygon mainnet
// using the upgraded multi-chain WalletManager skill.

import WalletManager, { CHAIN_CONFIG } from './wallet_manager_skill.js';

async function runVerification() {
    console.log("--- Commencing Live Systems Verification ---");

    // 1. Verify Private Key is set
    const rawKey = process.env.WALLET_PRIVATE_KEY;
    if (!rawKey) {
        console.error("\n[FAIL] 🛑 Prerequisite Failed: The WALLET_PRIVATE_KEY environment variable is not set.");
        console.log("--- Verification Aborted ---");
        return;
    }

    // Normalize: strip surrounding whitespace/newlines, add 0x prefix if missing
    const trimmed = rawKey.trim();
    const privateKey = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;

    console.log("[PASS] ✅ WALLET_PRIVATE_KEY is present.");
    console.log(`[DEBUG] Key length: ${privateKey.length}, starts with '0x': ${privateKey.startsWith('0x')}, first char code: ${privateKey.charCodeAt(0)}`);

    try {
        // 2. Initialize WalletManager for the Polygon Network
        console.log("\n--- Verifying Wallet Connectivity (Polygon) ---");
        const polygonWallet = new WalletManager(privateKey, CHAIN_CONFIG.polygon);
        const walletAddress = polygonWallet.getWalletAddress();
        console.log(`[PASS] ✅ WalletManager initialized for address: ${walletAddress}`);

        // 3. Fetch Balances on Polygon
        console.log("Fetching balances from the Polygon network...");
        const maticBalance = await polygonWallet.getNativeBalance();
        console.log(`[INFO] ℹ️ MATIC Balance: ${maticBalance}`);

        const usdcBalance = await polygonWallet.getErc20Balance(CHAIN_CONFIG.polygon.usdcAddress);
        console.log(`[INFO] ℹ️ USDC Balance: ${usdcBalance}`);

        if (parseFloat(usdcBalance) > 0) {
            console.log("[PASS] ✅ SUCCESS: USDC balance is confirmed. The wallet is funded and ready for trading.");
        } else {
            console.log("[WARN] ⚠️ USDC balance is 0. Trading cannot proceed, but wallet connectivity is confirmed.");
        }

    } catch (error) {
        console.error("\n[FAIL] 🛑 An error occurred during wallet verification:", error.message);
    } finally {
        console.log("\n--- Wallet Verification Complete ---");
    }
}

runVerification();
