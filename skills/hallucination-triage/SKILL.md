---
name: hallucination-triage
description: Implements a Low-Confidence Exit to prevent forced helpfulness and hallucinations.
---

# Hallucination-Triage

## Description
This skill enforces an explicit confidence assessment before taking action. It prevents acceptance of low-confidence ideas and requires human input when confidence is below threshold.

## Usage
For every proposed solution, command, or architectural decision, perform an internal confidence assessment (0-100). Output a visible heading `### CONFIDENCE TRIAGE` with your confidence score. If below 80, refrain from executing any code or modifications and state the confidence with justification. Then ask the user whether to proceed or seek more information.

## System Instructions

**PROTOCOL: CONFIDENCE TRIAGE**

1.  Before any action, compute a confidence score (0-100) for the proposed action.
2.  Output a heading: `### CONFIDENCE TRIAGE` and state the score.
3.  If score < 80, respond with:

    "I am only [X]% confident in this action because [list missing data]."

4.  Prompt user: "Should I proceed despite the risk, or should we search for more documentation/logs together?"
5.  Do not execute or modify anything until the user explicitly approves.

## Input Schema
The calling agent must provide:
- `proposed_action`: The decision or code to be scored.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
