---
name: circuit-breaker
description: Prevents infinite failure loops by halting execution after three consecutive failed commands.
---

# Circuit-Breaker

## Description
This skill prevents infinite failure loops by enforcing a hard stop after three consecutive failed commands. It forces the agent to surface the problem to the human operator rather than spiraling into increasingly desperate and potentially destructive retry attempts.

## Usage
This skill is active at all times. It triggers automatically when three consecutive shell commands, scripts, or installations fail in a row. It overrides all other execution protocols — no other skill or plan may bypass this halt.

## System Instructions

**PROTOCOL: CIRCUIT BREAKER**

### Tracking Failures

You must maintain a mental count of consecutive command failures during any task. The counter increments by one each time a shell command, script, or installation returns a non-zero exit code or produces an unexpected error. The counter resets to zero on any successful command execution.

### Trigger Condition

**If the consecutive failure count reaches THREE (3), the circuit breaker trips.**

### Execution Sequence (On Trip)

1.  **IMMEDIATE HALT:** Stop all execution. Do not attempt a fourth fix. Do not run another command. Do not suggest "one more thing to try."
2.  **Output the `### [CIRCUIT BREAKER TRIPPED]` Heading:** This must be highly visible in your response.
3.  **Provide the Following Under the Heading:**

    **Persistent Error:**
    *   A concise summary of the error that persists across all three attempts. Include the exact error message or exit code.

    **Attempted Fixes (3 of 3):**
    *   **Attempt 1:** What was tried and what happened.
    *   **Attempt 2:** What was tried and what happened.
    *   **Attempt 3:** What was tried and what happened.

    **Request for Human Intervention:**
    *   Explicitly ask the user to review the situation and provide guidance on how to proceed.

4.  **Wait:** Do not resume execution until the user responds with a new direction.

**Example of Required Workflow:**

> Agent attempts to install a Python package three times. Each attempt fails with a different approach.
>
> Agent:
> ### [CIRCUIT BREAKER TRIPPED]
>
> **Persistent Error:**
> `pip install cryptography` fails with `error: can't find Rust compiler` across all attempts.
>
> **Attempted Fixes (3 of 3):**
> - **Attempt 1:** Ran `pip install cryptography` directly. Failed — missing Rust toolchain.
> - **Attempt 2:** Ran `pip install --no-build-isolation cryptography`. Failed — same root cause.
> - **Attempt 3:** Attempted to install Rust via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`. Failed — network timeout.
>
> **Request for Human Intervention:**
> I've exhausted my approaches. The core issue appears to be a missing Rust compiler required to build `cryptography` from source. Paper Buddha, how would you like me to proceed? Options might include: installing a pre-built binary wheel, using a different package, or resolving the network issue first.

**Constraints:**
- You are **strictly forbidden** from attempting a fourth fix after the circuit breaker trips.
- This protocol **overrides** all other skills, including Plan-First-Act-Second and Rubber-Duck-Debugging. Those skills apply to failures 1–3. After failure 3, only Circuit-Breaker applies.
- The circuit breaker resets only when the user provides new guidance and the next command succeeds.

## Input Schema
The calling agent must provide:
- `failure_count`: The number of consecutive command failures.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
