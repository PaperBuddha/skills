---
name: "Recursive-Self-Improvement"
description: "Allows the agent to autonomously identify missing capabilities, draft new skill files, and deploy them to expand its own toolset."
tags:
- "openclaw-workspace"
- "evolution"
version: "1.1.0"
---

# Skill: Recursive Self-Improvement (RSI)

## Purpose
Grants the agent the ability to write, test, and deploy its own skills. When the agent encounters a persistent roadblock, repetitive manual task, or explicitly missing tool, it will use this protocol to code a permanent solution and integrate it into its own architecture.

## System Instructions
You are an OpenClaw agent equipped with the RSI protocol. You must strictly follow this loop when triggered:

1. **Trigger Condition**: Activate this protocol when you repeatedly fail a task due to a lack of a specific tool, when you identify a highly repetitive workflow that should be automated, or when the user commands "Build a skill for [X]."

2. **Mandatory Output**: When triggered, you MUST output the heading: `### RSI PROTOCOL INITIATED`.

3. **Core Logic (The Loop)**:
* **Phase 1 (Gap Analysis)**: Clearly state what capability is missing.
* **Phase 2 (Drafting)**: Write the logic for the new skill. You must format it using the standard OpenClaw `SKILL.md` boilerplate (including YAML frontmatter).
* **Phase 3 (Deployment)**: Use your shell/file tools to create a new folder in `/Users/openclaw/.openclaw/ncc1701z/workspace/skills/` and save the new `SKILL.md` file inside it.
* **Phase 4 (Verification)**: Confirm the file was written successfully to the correct absolute path.
* **Phase 5 (Mandatory Reflection)**: Upon completing any RSI task, you MUST immediately trigger the Metacognitive Reflection protocol. You must formally evaluate the building process, explicitly logging any terminal errors, workarounds (like adding stealth plugins), or persistent limitations (like CAPTCHA walls) into `lessons_learned.md`.

## Safety & Integration Rules
* **Strict Blacklist**: You are explicitly FORBIDDEN from modifying or overwriting `AGENTS.md`, `openclaw.json`, or the `recursive-self-improvement` skill itself (unless explicitly commanded by the user for a patch like this one).
* If a new skill fails to execute properly in subsequent tasks, immediately delete its folder from the `skills/` directory and log the failure in your `lessons_learned.md` file.
## Pre-Flight Resource Check (MANDATORY — runs before all other steps)

Before activating the RSI protocol for ANY reason, you MUST:

1. Check if the file `~/.openclaw/rsi-mode` exists.
2. Read its contents.
3. Apply the following rules strictly:

| File contents | Action |
|---|---|
| `enabled` | Proceed normally with RSI protocol |
| `conserve` or file missing | Log the gap to `lessons_learned.md` and STOP. Do NOT write skills, do NOT research, do NOT trigger Metacognitive Reflection. |

**Log format when stopping:**
```
[RSI BLOCKED - conserve mode] DATE - Gap identified: <what was missing>. RSI skipped to preserve API budget.
```

This check overrides all trigger conditions including repeated failures and explicit user requests (unless the user also sets the file to `enabled`). You may inform the user that RSI is in conserve mode and they can enable it by running `echo enabled > ~/.openclaw/rsi-mode`.

## Input Schema
The calling agent must provide:
- `gap_analysis`: The missing capability identified.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
