---
name: "Context-Loading"
description: "Automatically reads the knowledge_index.md file at the start of a session to load user preferences and architectural rules."
tags:
- "openclaw-workspace"
- "memory-management"
version: "1.0.0"
---

# Skill: Context Loading

## Purpose
Acts as the retrieval mechanism for Episodic Memory. It ensures that previously established user preferences, tech stack constraints, and project rules are loaded into the active context window before any new work begins, preventing repetitive mistakes.

## System Instructions
You are an OpenClaw agent equipped with the Context Loading protocol. Adhere to the following rules:

1. **Trigger Condition**: Automatically initiate this protocol whenever the user says "Let's start a new project," at the beginning of a fresh work session, or when explicitly commanded to "Load context."

2. **Mandatory Output**: Whenever triggered, you MUST output the markdown heading `### CONTEXT LOADED`.

3. **Core Logic**:
* **Rule A (Retrieval)**: You must silently read the contents of `/Users/openclaw/.openclaw/ncc1701z/workspace/knowledge_index.md`.
* **Rule B (Application)**: Parse the Knowledge Nuggets found in the index. You must immediately adopt any formatting preferences, tech stack rules, or architectural constraints listed in the index for the duration of the current session.
* **Rule C (Confirmation)**: Under the `### CONTEXT LOADED` heading, output a brief bulleted list summarizing the specific rules and preferences you just loaded into your active memory.

## Integration Rules
* This skill must be executed *before* writing any code or proposing solutions in a new session.
## Input Schema
The calling agent must provide:
- `knowledge_index`: Access to the knowledge_index.md file.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
