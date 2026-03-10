---
name: recursive-self-correction
description: Implements Chain of Verification (CoVe) to verify environment facts before using them as logic inputs.
---

# Recursive-Self-Correction

## Description
This skill enforces a Chain of Verification (CoVe) protocol that requires the agent to fact-check the output of any prior command before using it as an input for subsequent logic. It prevents cascading errors caused by stale paths, unexpected variable values, or misread environment state.

## Usage
This skill is active at all times. It applies automatically whenever the agent is about to use the result of a previous command (such as `ls`, `grep`, `pwd`, a variable assignment, or any captured output) as an input for the next action.

## System Instructions

**PROTOCOL: CHAIN OF VERIFICATION**

### Trigger Condition

Before using the output of ANY previous command as an input for your next action, you must perform a verification step. This includes but is not limited to:

- File paths returned by `ls`, `find`, `which`, `realpath`
- Variable values from assignments or subshells
- Content read from files via `cat`, `head`, `grep`
- Directory state from `pwd` or `cd`
- Process or service state from `ps`, `systemctl`, `brew services`

### Execution Sequence

1.  **Pause:** Do not use the prior output yet.
2.  **Output a Visible Heading:** `### VERIFICATION PHASE`
3.  **Explicitly Answer This Question:**
    > "Is this path, variable, or data exactly what I expected based on the system state?"
4.  **Evaluate for Discrepancies:**
    *   Does the path exist and point where expected?
    *   Is the variable value what the prior command should have produced?
    *   Does the file content match what was anticipated?
    *   Is there ANY discrepancy, even minor (wrong directory depth, unexpected suffix, extra whitespace, stale cache)?
5.  **If Discrepancy Found (even 1%):**
    *   You are **strictly forbidden** from proceeding.
    *   Re-scan the environment to verify the fact. For example:
        *   Re-run `ls` or `find` to confirm the path.
        *   Re-run `cat` to confirm file contents.
        *   Re-run `echo "$VAR"` to confirm the variable value.
    *   Only after the re-scan confirms the correct state may you proceed.
6.  **If No Discrepancy:** State "Verified — proceeding." and continue.

**Example of Required Workflow:**

> Agent runs `find . -name "config.yaml"` and gets `/app/config.yaml`.
> Agent is about to use this path in `sed -i 's/debug: true/debug: false/' /app/config.yaml`.
>
> Agent:
> ### VERIFICATION PHASE
> **Question:** Is `/app/config.yaml` exactly what I expected?
> **Check:** The project root is `/app` and config files live at the root level. This path looks correct.
> **Verification:** Running `ls -la /app/config.yaml` to confirm existence and permissions.
> *(runs ls, confirms file exists and is writable)*
> Verified — proceeding.

**Counter-Example (Discrepancy Detected):**

> Agent runs `pwd` and gets `/app/skills/frontend-guru`.
> Agent is about to write a new skill file here.
>
> Agent:
> ### VERIFICATION PHASE
> **Question:** Is this the correct directory for new skill creation?
> **Check:** New skills should go in `/app/skills/<skill-name>/`, not inside `frontend-guru/`.
> **Discrepancy Found:** Current directory is inside another skill's folder. This is wrong.
> **Action:** Re-scanning with `ls /app/skills/` to identify the correct target directory before proceeding.

**Constraint:**
If you realize you used a prior command's output without a preceding `### VERIFICATION PHASE`, STOP, acknowledge the gap, and retroactively verify the data before continuing.

## Input Schema
The calling agent must provide:
- `previous_output`: The data to be fact-checked.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
