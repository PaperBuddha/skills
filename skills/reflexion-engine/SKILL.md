---
name: reflexion-engine
description: Forces a self-correction loop to review code for security, edge cases, and syntax errors before execution.
---

# Reflexion-Engine

## Description
This skill enforces a self-correction loop that forces the agent to critique its own planned code/commands before execution. It aims to reduce security vulnerabilities, edge-case failures, and syntax errors by requiring an explicit senior-review pass.

## Usage
This skill applies before:
- Finalizing any code block in chat (i.e., presenting code as "the answer")
- Executing any system command (shell commands, scripts, installs)

It can be combined with planning/debugging skills, but it must run immediately before execution/final output.

## System Instructions

**PROTOCOL: SELF-CRITIQUE BEFORE EXECUTION**

### Trigger Condition

Before you finalize ANY code block (in a user-visible response) OR execute ANY system command, you must run this protocol.

### Execution Sequence

1.  **Pause Execution:** Do not execute the command yet and do not present the final code as complete.
2.  **Output a Highly Visible Heading:** `### SELF-CRITIQUE`
3.  **Act as a Strict Senior Reviewer:** Review your own proposed work as if you are reviewing a pull request.
4.  **Mandatory Checks (at minimum):**

    **Security Review**
    - Secrets handling (API keys, tokens, credentials) — none should be hardcoded.
    - Injection risks (SQL injection, shell injection, template injection).
    - Unsafe file operations (path traversal, destructive deletes).
    - Network safety (SSRF risks, untrusted URLs, redirects).
    - Dependency safety (unvetted installs, suspicious packages).

    **Edge Cases / Reliability**
    - Missing files/dirs, empty inputs, unexpected content types.
    - Timeouts, retries, backoff, rate limits.
    - Partial failures and idempotency.
    - Platform differences (macOS vs Linux).

    **Syntax / Correctness**
    - Validate shell quoting and flags.
    - Validate Python syntax, imports, and typing.
    - Ensure commands are complete and runnable.

5.  **If Issues Are Found:**
    - Explicitly state each flaw.
    - Rewrite the code/commands to fix the issue(s).
    - Re-run a brief critique on the revised version.

6.  **Only Then Proceed:** After the critique is complete (and fixes applied if needed), you may present the final code or execute the command.

**Example of Required Workflow:**

> Agent prepares to run: `rm -rf ${DIR}`
>
> Agent:
> ### SELF-CRITIQUE
> - **Security:** Risk of deleting unintended paths if DIR is empty or malformed.
> - **Fix:** Use a guard, verify DIR is non-empty and inside an allowed base directory; prefer `trash` when possible.
>
> Revised command:
> `test -n "$DIR" && [[ "$DIR" == /safe/base/* ]] && rm -rf -- "$DIR"`

**Constraint:**
If you notice you executed a command or finalized code without a preceding `### SELF-CRITIQUE` in the immediate context, STOP, acknowledge the lapse, and apply the critique retroactively before continuing.

## Input Schema
The calling agent must provide:
- `proposed_code`: The code or command to be reviewed.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
