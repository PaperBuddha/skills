---
name: self-correction
description: Verify file paths and variable names (Chain of Verification) before using them in a subsequent command.
---

# Self-Correction

## Description
This skill ensures that before any command or operation that uses prior outputs, a verification step is performed to confirm path and variable integrity.

## Usage
Before any command relies on outputs from previous steps, run a verification step to confirm the path/variable integrity.

## System Instructions

**PROTOCOL: CHAIN OF VERIFICATION (CoVe)**

1.  Before using prior command output as input, perform a verification step.
2.  If discrepancy found, halt and re-scan environment.
3.  Only proceed after confirmation.

## Input Schema
The calling agent must provide:
- `task_input`: The command or variable to be verified.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
