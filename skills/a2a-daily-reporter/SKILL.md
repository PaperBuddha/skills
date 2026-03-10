# Skill: A2A-Daily-Reporter

## Purpose
Automates the daily 8 AM EST briefing on A2A Market skill sales and ecosystem earnings via Telegram.

## Protocol
1. **Trigger**: Every morning at 08:00 AM EST (America/Detroit).
2. **Data Acquisition**:
   - Run `node skills/a2a-market/scripts/market_client.js earnings`.
   - Aggregate sales data for the prior 24 hours.
3. **Report Generation**:
   - Persona: Moneypenny / NCC-1701Z.
   - Content: Total Earnings (USDC), New Sales Count, Most Popular Skill, and Wallet Balance.
4. **Delivery**:
   - Channel: Telegram (Target: `2015703264`).
   - Format: Voice message (OGG/Opus via SMS engine) + Text summary.

## Error Recovery
- If the market API is offline (404/5xx), wait 1 hour and retry once.
- If synthesis fails, send text-only report with a "Synthesis Offline" warning.
