---
name: "Wash-Trade-Detector"
description: "Detects and flags wash trades in NFT transaction data using 7 confidence-weighted patterns, protecting all downstream scoring and signals from artificial inflation."
tags:
- "openclaw-workspace"
- "data-integrity"
- "nft"
- "blockchain"
version: "1.0.0"
---

# Skill: Wash Trade Detector

## Purpose
Identifies and flags non-genuine transactions (wash trades) in NFT sales data. Wash trading artificially inflates price history, volume, and collector demand. This skill applies 7 weighted detection patterns to exclude fraudulent activity from downstream scoring models and analytics pipelines.

## System Instructions
You are an OpenClaw agent equipped with the Wash Trade Detector protocol. Adhere to the following rules strictly:

1. **Trigger Condition**:
    *   Activate on *every* sales transaction record before it is used in any scoring calculation, signal detection, or analysis.
    *   **Action**: Tag transactions. Do not delete them.

2. **Detection Patterns (Hierarchy)**:

    *   **Pattern 1: Direct Self-Trade (High Confidence)**
        *   *Criteria*: Seller wallet == Buyer wallet.
        *   *Flag*: `wash_trade_confirmed`
        *   *Confidence*: **95**

    *   **Pattern 2: Rapid Return Trade (High Confidence)**
        *   *Criteria*: A sells to B, then B sells back to A within 30 days.
        *   *Flag*: `wash_trade_confirmed`
        *   *Confidence*: **90**

    *   **Pattern 3: Circular Trade Chain (High Confidence)**
        *   *Criteria*: A -> B -> C -> A within 60 days.
        *   *Flag*: `wash_trade_confirmed`
        *   *Confidence*: **85**

    *   **Pattern 4: Funded Buyer (Medium Confidence)**
        *   *Criteria*: Buyer wallet received funds directly from Seller wallet <72h before purchase.
        *   *Flag*: `wash_trade_suspected`
        *   *Confidence*: **70**
        *   *Weight Reduction*: **70%** (Count only 30% of value).

    *   **Pattern 5: Zero or Below-Floor Price (Medium Confidence)**
        *   *Criteria*: Price is 0 OR >90% below established floor.
        *   *Flag*: `wash_trade_suspected`
        *   *Confidence*: **65**
        *   *Weight Reduction*: **50%**

    *   **Pattern 6: High Frequency Same-Pair (Medium Confidence)**
        *   *Criteria*: Same wallet pair trades 5+ times within 90 days.
        *   *Flag*: `wash_trade_suspected`
        *   *Confidence*: **60**
        *   *Weight Reduction*: **40%**

    *   **Pattern 7: New Wallet Spike (Low Confidence)**
        *   *Criteria*: Buyer wallet created <7 days ago, no other history.
        *   *Flag*: `wash_trade_possible`
        *   *Confidence*: **40**
        *   *Weight Reduction*: **20%**

3. **Enforcement Rules**:

    *   **wash_trade_confirmed (Confidence 85+)**:
        *   **Action**: **EXCLUDE ENTIRELY** from all scoring models (Trajectory, Velocity, Price Floor, Signals).
        *   **Collector Score**: Do not count buyer as a legitimate collector.
        *   **Price History**: Exclude price point from charts.
        *   **Storage**: Preserve in DB1 with flag.

    *   **wash_trade_suspected (Confidence 60-84)**:
        *   **Action**: Apply weight reduction (see patterns).
        *   **Storage**: Flag in DB2 as `reduced_weight = true`.
        *   **Collector Score**: Do not count buyer as "high-signal".

    *   **wash_trade_possible (Confidence <60)**:
        *   **Action**: Log flag but include at full weight.
        *   **Monitor**: If multiple "possible" flags accumulate for one wallet, escalate to suspected.

4. **Recording Requirements**:
    Every flagged transaction must store:
    *   `wash_trade_flag` (boolean)
    *   `wash_trade_confidence` (0-100)
    *   `wash_trade_pattern` (e.g., "Pattern 1: Direct Self-Trade")
    *   `wash_trade_status` (confirmed / suspected / possible)
    *   `weight_applied` (0.0 - 1.0)
    *   `flagged_at` (Timestamp)

5. **Artist Impact Assessment**:
    *   Calculate `wash_trade_ratio`: (Flagged Volume / Total Volume).
    *   If ratio > **40%**: Mark artist record with `high_wash_trade_risk = true`.
    *   **Transparency**: Surface this risk flag in API responses. Do not hide it.

6. **Guardrails**:
    *   **Non-Destructive**: Never delete a transaction. Only flag/tag.
    *   **Scope**: Do not flag transactions from known traditional auction houses (wash trading logic applies to on-chain data).
    *   **Confirmation**: Never mark `confirmed` without a Pattern 1, 2, or 3 match.
    *   **Disputes**: If disputed, log but do not auto-remove flag. Requires manual review.