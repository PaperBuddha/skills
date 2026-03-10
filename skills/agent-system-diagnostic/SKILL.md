---
name: agent-system-diagnostic
description: "Verify operational readiness of external dependencies. Triggers when user says: (1) 'run pre-flight', (2) 'check systems', (3) 'verify dependencies', (4) 'diagnose [Target]', or (5) 'is [X] up?'."
---

# Ship's Diagnostic (Pre-Flight)

## Purpose
Ensures that all environment variables, API endpoints, and local files required for a task are functional BEFORE execution begins.

## System Instructions
1. **Scope Check**: Identify all external requirements for the requested task (e.g., an API key in .env, a specific script, or a remote URL).
2. **Execution**: Use `exec` with `curl -I` for URLs and `ls` or `grep` for local environment verification.
3. **Status Board**: Present results in a structured table:
   | Dependency | Status | Detail |
   | :--- | :--- | :--- |
   | [Target Name] | ✅/❌ | [Ping ms or Error Code] |
4. **No-Go Logic**: If any mission-critical dependency is ❌, STOP execution and present a **Remediation Plan** (e.g., "Run export API_KEY=..." or "The server is returning 500").

## Guardrails
- **Read-Only**: This skill only performs health checks; it does not modify files or environment states without user approval.
- **Privacy**: Never print full private keys or secrets in the status board; show only the first/last 4 characters (e.g., `0x52...A910`).
