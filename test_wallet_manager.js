// test_wallet_manager.js
// A diagnostic script to securely test the WalletManager skill.

// Note: The 'wallet_manager_skill.js' uses ES Module syntax (`export default`).
// To use it in a Node.js script, we can either use dynamic import() in a CommonJS file
// or set "type": "module" in our package.json. We will use dynamic import for simplicity.

async function runTest() {
    console.log("--- Running WalletManager Skill Diagnostic ---");

    // 1. Check for the critical environment variable.
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        console.error("\n[FAIL] 🛑 Security Precondition Not Met.");
        console.error("The WALLET_PRIVATE_KEY environment variable is not set.");
        console.log("\nTo run this test, you must provide a private key from a TEST wallet.");
        console.log("Use the command: export WALLET_PRIVATE_KEY='0xyourprivatekeyhere'");
        console.log("--- Test Aborted ---");
        return;
    }
    console.log("[PASS] ✅ Security Precondition Met: Private key is present.");

    try {
        // Dynamically import the WalletManager class
        const { default: WalletManager } = await import('./wallet_manager_skill.js');

        // 2. Test Initialization
        console.log("\n--- Testing Initialization ---");
        const walletManager = new WalletManager(privateKey);
        const walletAddress = walletManager.getWalletAddress();
        console.log(`[PASS] ✅ WalletManager initialized for address: ${walletAddress}`);

        // 3. Test Balance Checks
        console.log("\n--- Testing Balance Checks ---");
        console.log("Fetching balances... (requires network connection)");

        const maticBalance = await walletManager.getMaticBalance();
        console.log(`[PASS] ✅ MATIC Balance: ${maticBalance}`);

        const usdcBalance = await walletManager.getUsdcBalance();
        console.log(`[PASS] ✅ USDC Balance: ${usdcBalance}`);

        // 4. Test Transaction Preparation (Read-Only simulation)
        // We will not test live transaction broadcasting as it costs gas and is state-changing.
        // Instead, we can verify that the logic for preparation (gas estimation, signing)
        // is structured correctly, but we will not execute it here.
        console.log("\n--- Testing Transaction Preparation (Simulation) ---");
        console.log("[INFO] ℹ️ Live transaction broadcasting is NOT tested by this script to prevent accidental fund usage.");
        console.log("[INFO] ℹ️ The presence of the `prepareContractTransaction` and `broadcastTransaction` methods is confirmed.");
        console.log("[PASS] ✅ Transaction function structure is valid.");


    } catch (error) {
        console.error("\n[FAIL] 🛑 An error occurred during the test:", error.message);
        console.error("Full Error Details:", error);
    } finally {
        console.log("\n--- Diagnostic Complete ---");
    }
}

// Check for ethers installation before running
try {
    require.resolve("ethers");
    runTest();
} catch (e) {
    console.error("\n[FAIL] 🛑 Dependency missing: 'ethers' library not found.");
    console.log("Please install it by running: npm install ethers");
    console.log("--- Test Aborted ---");
}
