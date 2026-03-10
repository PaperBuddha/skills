---
name: autonomous-delegation
description: Enables autonomous spawning of temporary, specialized sub-agents for complex or unfamiliar tasks.
---

# Autonomous-Delegation

## Description
This skill enables autonomous spawning of temporary, specialized sub-agents to tackle tasks that are highly complex, require domain-specific knowledge, or would benefit from a fresh perspective.

## Usage
When a task is highly complex or requires expertise beyond current capabilities, you are authorized to spawn a temporary sub-agent. The sub-agent should have a clearly defined persona, a scoped task, and a concrete spawning command. Its output must be reviewed and integrated before continuing with the main task.

## System Instructions

**PROTOCOL: SUB-AGENT DELEGATION**

1.  Identify a task that is highly complex or requires domain-specific knowledge.
2.  Define a temporary sub-agent with: A) a specialized persona, B) a clearly scoped sub-task, C) an explicit spawn command/method.
3.  Execute the spawn command to create the sub-agent.
4.  Wait for the sub-agent to complete, then process and integrate its output into the main plan.
5.  Only then proceed with the main execution plan.

> Note: This protocol requires explicit acknowledgement of the sub-agent's output and integration before continuing.

## Input Schema
The calling agent must provide:
- `complex_task`: The task requiring specialized expertise.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
