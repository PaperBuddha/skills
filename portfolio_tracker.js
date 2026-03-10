// portfolio_tracker.js
// Monitors assets in a self-custodial wallet and a Polymarket account.

import axios from 'axios';

// --- CONFIGURATION ---
const SELF_CUSTODIAL_WALLET = '0x52B4B128Cc81c87cB23E6d46B89552802047A910';
const POLYMARKET_WALLET = '0xa88035B1a2B31773C818239E3FC0d4ee605a2fff';
const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const CHAIN_ID = 137; // Polygon Mainnet

// --- API FUNCTIONS ---

/**
 * Fetches and displays all token balances from the self-custodial wallet using Covalent API.
 */
async function getSelfCustodialWalletBalances(apiKey) {
    if (!COVALENT_API_KEY) {
        console.error('\n[FAIL] 🛑 Prerequisite Failed: The COVALENT_API_KEY environment variable is not set.');
        return;
    }

    console.log(`\n--- Querying Balances for Self-Custodial Wallet: ${SELF_CUSTODIAL_WALLET} ---`);
    const url = `https://api.covalenthq.com/v1/${CHAIN_ID}/address/${SELF_CUSTODIAL_WALLET}/balances_v2/?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const { data } = response.data;

        if (!data || !data.items || data.items.length === 0) {
            console.log('[INFO] ℹ️ No token balances found for this address.');
            return;
        }

        console.log('Token Balances:');
        data.items.forEach(token => {
            const balance = parseFloat(token.balance) / (10 ** token.contract_decimals);
            if (balance > 0) {
                 const value = token.quote_rate ? `($${(token.quote_rate * balance).toFixed(2)})` : '';
                 console.log(`  - ${token.contract_ticker_symbol}: ${balance.toFixed(4)} ${value}`);
            }
        });

    } catch (error) {
        const errorMessage = error.response?.data?.error_message || error.message;
        console.error(`[FAIL] 🛑 Error fetching balances from Covalent: ${errorMessage}`);
    }
}

/**
 * Fetches and displays the portfolio from Polymarket.
 */
async function getPolymarketPortfolio() {
    console.log(`\n--- Querying Portfolio for Polymarket Account: ${POLYMARKET_WALLET} ---`);
    const url = `https://data-api.polymarket.com/positions?user=${POLYMARKET_WALLET}`;

    try {
        const response = await axios.get(url);
        const positions = response.data;

        if (!positions || positions.length === 0) {
            console.log('[INFO] ℹ️ No active positions found on Polymarket.');
            return;
        }
        
        // Calculate total portfolio value
        const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);

        console.log(`[INFO] ℹ️ Total Portfolio Value: $${totalValue.toFixed(2)}`);
        console.log('Active Positions:');
        positions.forEach(pos => {
            console.log(`  - Market: "${pos.title}"`);
            console.log(`    - Position: ${pos.size.toFixed(2)} shares of "${pos.outcome}"`);
            console.log(`    - Avg Price: $${pos.avgPrice.toFixed(4)}`);
            console.log(`    - Current Value: $${pos.currentValue.toFixed(2)}`);
            console.log(`    - P/L: $${pos.cashPnl.toFixed(2)} (${pos.percentPnl.toFixed(2)}%)`);
            console.log('    ---');
        });

    } catch (error) {
        console.error(`[FAIL] 🛑 Error fetching portfolio from Polymarket: ${error.message}`);
    }
}

/**
 * Main function to run the portfolio tracker.
 */
async function runTracker(apiKey) {
    if (!apiKey) {
        console.error('\n[FAIL] 🛑 Prerequisite Failed: API key was not provided as an argument.');
        return;
    }
    console.log("--- Commencing Portfolio Tracking ---");
    await getSelfCustodialWalletBalances(apiKey);
    await getPolymarketPortfolio();
    console.log("\n--- Portfolio Tracking Complete ---");
}

// Get the API key from the command-line arguments
const apiKey = process.argv[2];

// Run the main tracker function
runTracker(apiKey);
