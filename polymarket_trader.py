import os
import asyncio
from dotenv import load_dotenv
from py_clob_client import ClobClient, PolyChain
from py_clob_client.clob_types import Market

# Load environment variables from .env file
load_dotenv()

async def find_active_markets(client: ClobClient):
    """
    Fetches all markets and filters for active, short-term crypto markets.
    """
    print("Fetching markets...")
    try:
        markets = await client.get_markets()
        print(f"Found {len(markets)} markets in total.")

        active_crypto_markets = []
        for market in markets:
            # Simple filter: check if 'active' is True and 'BTC' or 'ETH' is in the question
            # The API seems to have issues with the 'active' flag, but we'll try
            if market.active and ("BTC" in market.question.upper() or "ETH" in market.question.upper()):
                 active_crypto_markets.append(market)

        if not active_crypto_markets:
            print("No active BTC or ETH markets found with the current filter.")
            # Fallback: Print the 5 most recently updated markets if primary filter fails
            print("Showing 5 most recently updated markets as a fallback:")
            sorted_markets = sorted(markets, key=lambda m: m.updated_at, reverse=True)
            for i, market in enumerate(sorted_markets[:5]):
                print(f"  {i+1}. {market.question} (ID: {market.condition_id}, Active: {market.active})")
            return None

        print("\\n--- Found Active Crypto Markets ---")
        for i, market in enumerate(active_crypto_markets):
            print(f"  {i+1}. {market.question} (ID: {market.condition_id})")
        
        # For now, let's select the first one we find
        return active_crypto_markets[0]

    except Exception as e:
        print(f"An error occurred while fetching markets: {e}")
        return None

async def trade_logic(market: Market):
    """
    Placeholder for the main trading logic.
    This will eventually connect to the WebSocket and monitor for the Oracle Gap.
    """
    print(f"\\n--- Preparing to trade on market: {market.question} ---")
    print(f"Condition ID: {market.condition_id}")
    print("This is where the real-time monitoring and trading execution will occur.")
    # TODO:
    # 1. Get asset_ids from the market object.
    # 2. Use websocat or a python websocket client to connect and subscribe.
    # 3. Monitor the stream for price discrepancies.
    # 4. Use the client.post_order() to place a bet when an opportunity is found.
    pass

async def main():
    """
    Main function to initialize the client and run the process.
    """
    api_key = os.getenv("POLY_API_KEY")
    api_secret = os.getenv("POLY_API_SECRET")
    api_passphrase = os.getenv("POLY_API_PASSPHRASE")

    if not all([api_key, api_secret, api_passphrase]) or "YOUR_API_KEY_HERE" in api_key:
        print("ERROR: API credentials are not set. Please update the .env file.")
        return

    # Initialize the client for the Polygon Mainnet
    client = ClobClient(host="https://clob.polymarket.com", chain_id=PolyChain.POLYGON_MAINNET)
    
    # Set credentials
    creds = {"key": api_key, "secret": api_secret, "passphrase": api_passphrase}
    client.set_api_creds(creds)
    print("ClobClient initialized.")

    # Step 1: Find a suitable market
    target_market = await find_active_markets(client)

    # Step 2: If a market is found, proceed with trade logic
    if target_market:
        await trade_logic(target_market)
    else:
        print("\\nMission aborted: Could not identify a suitable market.")


if __name__ == "__main__":
    asyncio.run(main())
