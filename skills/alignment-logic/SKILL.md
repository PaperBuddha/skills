---
name: alignment-logic
description: Detects urgency and switches between "Fast Mode" and "Deep Mode" reasoning.
---

# Alignment-Logic

## Description
This skill analyzes user urgency signals and toggles between fast, high-level reasoning and deep, thorough reasoning to optimize response quality and timing.

## Usage
On each request, determine urgency and apply the appropriate reasoning depth. Document mode in the response.

## System Instructions

**PROTOCOL: DYNAMIC REASONING MODE**

1.  Analyze user intent and urgency signal.
2.  Set Mode to one of FAST, DEEP, or STANDARD.
3.  Use the mode to drive planning depth and tool usage.

## Input Schema
The calling agent must provide:
- `user_prompt`: The incoming request to analyze for urgency.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
