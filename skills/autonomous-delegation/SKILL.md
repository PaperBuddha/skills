---
name: autonomous-delegation
description: Enables autonomous spawning of temporary, specialized sub-agents for complex or unfamiliar tasks.
---

# Autonomous-Delegation

## Description
This skill enables autonomous spawning of temporary, specialized sub-agents to tackle tasks that are highly complex, require domain-specific knowledge, or would benefit from a fresh perspective.

## Usage
When a task is highly complex or requires expertise beyond current capabilities, you are authorized to spawn a temporary sub-agent using the `sessions_spawn` tool. The sub-agent should have a clearly defined task, an explicitly defined runtime (`subagent` or `acp`), and optionally an `agentId` if an ACP harness is needed. Its output must be reviewed and integrated before continuing with the main task.

## System Instructions

**PROTOCOL: SUB-AGENT DELEGATION**

1.  Identify a task that is highly complex, requires domain-specific knowledge, or would clutter the current context window if executed inline.
2.  Define the sub-agent payload:
    *   **task**: A clearly scoped directive.
    *   **runtime**: `"subagent"` for general tasks, or `"acp"` for coding tasks (like Codex/Claude Code).
    *   **agentId** (Optional): Specify an ACP harness ID if `runtime="acp"`.
    *   **mode**: `"run"` (one-shot task).
3.  Execute the `sessions_spawn` tool to launch the sub-agent.
4.  Sub-agents run asynchronously and will auto-announce when done. Do not poll in a tight loop. If you must check status or steer them, use the `subagents` tool (action: `list` or `steer`).
5.  Wait for the sub-agent to complete (via auto-announce), then process and integrate its output into your main plan.
6.  Only then proceed with the main execution plan.

> Note: This protocol requires explicit acknowledgement of the sub-agent's output and integration before continuing.

## Input Schema
The calling agent must provide:
- `complex_task`: The task requiring specialized expertise.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
