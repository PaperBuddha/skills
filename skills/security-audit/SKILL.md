---
name: "Security-Audit"
description: "Scans skill folders for hardcoded secrets (API keys, private keys), absolute paths, and permission risks before publication."
tags:
- "openclaw-workspace"
- "security"
- "dev-tool"
version: "1.0.0"
---

# Skill: Security Audit

## Purpose
A static analysis tool to prevent accidental leakage of sensitive credentials or environment-specific paths in OpenClaw skills. Run this before publishing any skill to a registry or sharing it.

## Capabilities

### 1. Scan Skill
Recursively scans a target directory for:
*   Google/OpenAI/Anthropic API Keys
*   AWS Access Keys
*   64-character Hex Strings (Private Keys)
*   Bearer Tokens
*   Hardcoded Absolute Paths (`/Users/`, `/home/`)

*   **Command**: `node skills/security-audit/scripts/audit.js <path_to_skill>`

## Security Constraints
*   **Read-Only**: This skill strictly reads files; it does not modify or delete anything.
*   **Local Scope**: It operates only on the path provided in the argument.
*   **No Network**: It performs no network requests; all checks are local regex.

## Input Schema
The calling agent must provide:
- `target_path`: The directory or file to scan.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
