---
name: agent-resource-manager
description: "Monitor and limit API/token usage to prevent budget exhaustion. Triggers when user says: (1) 'check budget', (2) 'usage report', (3) 'stop at [Limit]', (4) 'why is this expensive?', or (5) 'are we burning too much?'."
---

# Ship's Resource Manager (Budget Control)

## Purpose
Prevents "slaughter by API calls" by providing real-time visibility into token burn and enforcing turn-limits on repetitive diagnostic loops.

## System Instructions
1.  **Metric Retrieval**: Immediately run the `session_status` tool (📊 session_status) to pull current Input/Output token counts, cost estimates, and current model provider.
2.  **Provider-Aware Constraints**: Apply the following conservative "Safe Zones" based on standard Google AI (Free Tier) limits:
    - **RPM (Requests Per Min)**: Limit to 10. If > 8, insert a 5s delay between tool calls.
    - **RPD (Requests Per Day)**: Limit to 1,000. If > 800, stop non-critical tasks.
    - **TPM (Tokens Per Min)**: Limit to 500k.
3.  **Stateful Monitoring**: Maintain a rolling count of requests in `memory/usage_stats.json`. Reset at Midnight Pacific Time.
4.  **Efficiency Audit**:
    *   Identify "Expensive Patterns" (e.g., repeating a `web_fetch` that returns the same 404/500 error).
    *   Identify "Context Bloat" (if input tokens exceed 30,000, context compaction is required).
5.  **Automatic Halting**:
    *   If a task requires > 5 consecutive `exec` calls without achieving a state change, STOP and ask the user for a refined strategy.
    *   If total session cost exceeds **$2.00**, or if RPD hits 90%, output a **MANDATORY BUDGET WARNING** before any further tool calls.

## Output Format (Usage Report)
Present a concise dashboard:
### 💳 RESOURCE DISCIPLINE REPORT
- **Current Session Cost**: $[Amount]
- **Burn Rate**: [Calls/Last 10 min]
- **Wallet Status**: [Estimated remaining turns based on $0.05/avg turn]
- **Recommendation**: [e.g., Run Compactor | Stop API Loop | Switch Model]

## Guardrails
- **Minimalism**: This skill must use exactly ONE tool call (`session_status`) per invocation. 
- **Privacy**: Do not store full conversation logs in budget memory; only counts and costs.
