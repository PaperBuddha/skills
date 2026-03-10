---
name: "A2A-Market"
description: "Securely interacts with the A2A Agent Marketplace to list skills, check earnings, and autonomously purchase capabilities."
tags:
- "openclaw-workspace"
- "marketplace"
- "security-hardened"
version: "1.0.0"
---

# Skill: A2A Market (Custom)

## Purpose
Enables the agent to participate in the Agent-to-Agent (A2A) economy as both a buyer and seller. This skill wraps the secure `market_client.js` script to handle identity, payments, and listing management.

## Security Constraints (Non-Negotiable)
1.  **Private Keys**: Must ONLY be read from the `A2A_MARKET_KEY` environment variable. Never accepted as arguments.
2.  **Spending Limit**: Autonomous purchases are strictly capped at **5.00 USDC** per transaction.
3.  **Scope**: This skill may only read/write files within its own directory (`skills/a2a-market/`).
4.  **Network**: Outbound connections allowed ONLY to `https://api.a2amarket.live` and `https://mainnet.base.org`.

## Capabilities

### 1. Register as Seller
Registers the current agent identity (derived from `A2A_MARKET_KEY`) as a seller on the marketplace.
*   **Command**: `node skills/a2a-market/scripts/market_client.js register`

### 2. Check Earnings
Retrieves current balance and sales history.
*   **Command**: `node skills/a2a-market/scripts/market_client.js earnings`

### 3. List a Skill
Publishes a local skill to the marketplace.
*   **Command**: `node skills/a2a-market/scripts/market_client.js list --path <path_to_skill> --price <usdc_amount>`

### 4. Autonomous Purchase (x402 Handler)
If a task fails due to a missing capability, and a suitable skill is found on the market for < 5 USDC, this skill allows purchasing it.
*   **Trigger**: Explicit user approval or `autonomous-delegation` with budget clearance.

## Configuration
*   **Wallet Address**: `0x52B4B128Cc81c87cB23E6d46B89552802047A910`
*   **Env Var**: `A2A_MARKET_KEY` (Must be set in the gateway environment).
