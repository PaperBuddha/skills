---
name: rubber-duck-debugging
description: Forces systematic debugging and log analysis after any command failure.
---

# Rubber-Duck-Debugging

## Description
This skill enforces a strict debugging protocol after any command failure. It prevents blind retry loops by mandating structured analysis, log review, and a proposed fix before any further execution.

## Usage
This skill is active at all times. It applies automatically whenever a shell command, script, or test returns a non-zero exit code or produces unexpected error output.

## System Instructions

**PROTOCOL: MANDATORY DEBUGGING**

If ANY shell command, script, or test **fails** (non-zero exit code, unexpected error in stderr/stdout, or a test assertion failure), you must adhere to the following sequence:

1.  **Halt Immediately:** Do not execute another command. Do not blindly retry. Do not guess at a fix.
2.  **Output a `### DEBUGGING PHASE` Heading:** You must output a visible `### DEBUGGING PHASE` section in your response.
3.  **Complete All Three Steps (in order):**

    **Step 1 — Analyze the Failure:**
    *   Read the full stderr and stdout output from the failed command.
    *   Identify the root cause of the failure (syntax error, missing dependency, permission issue, incorrect path, logic error, etc.).
    *   State the root cause clearly.

    **Step 2 — Check Relevant Logs:**
    *   Inspect any relevant system or application logs that may provide additional context.
    *   Examples: `journalctl`, application log files, build output, test runner output, `dmesg`, etc.
    *   If no additional logs are relevant, explicitly state: "No additional logs apply to this failure."

    **Step 3 — Propose a Fix:**
    *   Write out a specific, actionable proposed fix.
    *   Detail exactly what command or code change will be made and why it addresses the root cause.

4.  **Resume Execution:** Only after all three steps have been fully output to the chat context may you execute the next command.

**Example of Required Workflow:**

> Agent runs: `npm run build`
> Command fails with: `Error: Cannot find module 'react-dom/client'`
>
> Agent:
> ### DEBUGGING PHASE
> **Step 1 — Analyze the Failure:**
> The build failed because the module `react-dom/client` cannot be resolved. This typically means `react-dom` is either not installed or is an older version that lacks the `/client` export.
>
> **Step 2 — Check Relevant Logs:**
> Checking `package.json` for the installed `react-dom` version and `node_modules` for its presence.
>
> **Step 3 — Proposed Fix:**
> Install or upgrade `react-dom` to v18+: `npm install react-dom@latest`
>
> *Now* I am ready to execute the fix.

**Constraint:**
If you find yourself retrying a failed command without a preceding `### DEBUGGING PHASE` in the immediate context, **STOP**. Apologize, generate the debugging phase, and then proceed.

## Input Schema
The calling agent must provide:
- `error_output`: The failed command's stderr/stdout.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
