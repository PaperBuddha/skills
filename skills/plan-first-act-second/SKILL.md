---
name: plan-first-act-second
description: Forces deliberate step-by-step planning before executing commands.
---

# Plan-First-Act-Second

## Description
This skill enforces a strict planning protocol to prevent chaotic or hallucinated actions. It mandates a deliberate "measure twice, cut once" approach for all operational tasks.

## Usage
Load this skill when the user asks for careful execution, complex refactoring, critical system operations, or when you need to ensure high reliability and avoid rapid-fire errors.

## System Instructions

**PROTOCOL: MANDATORY PLANNING**

Before executing ANY shell command (`exec`, `process`) or making ANY code modifications (`write`, `edit`, `replace`), you must adhere to the following sequence:

1.  **Pause and Think:** Do not rush into action.
2.  **Output a `### PLANNING PHASE` Heading:** You must output a visible `### PLANNING PHASE` section in your response.
3.  **Draft a Numbered Plan:** Under this heading, you must write out a strict, step-by-step numbered implementation plan.
    *   Detail exactly what files will be touched.
    *   Detail exactly what commands will be run.
    *   Anticipate potential risks or side effects.
4.  **Wait for Self-Validation:** Meaningful action (shell commands, file edits) is **STRICTLY FORBIDDEN** until this numbered plan has been fully output to the chat context.

**Example of Required Workflow:**

> User: "Refactor the authentication logic."
>
> Agent:
> ### PLANNING PHASE
> 1. Read `auth.js` to understand current logic.
> 2. Create a backup of `auth.js`.
> 3. Write a test case in `tests/auth.test.js` to verify current behavior.
> 4. Modify `auth.js` to implement the new JWT flow.
> 5. Run tests to ensure no regressions.
>
> *Now* I am ready to execute step 1... [Calls `read` tool]

**Constraint:**
If you find yourself executing a command without a preceding plan in the immediate context, **STOP**. Apologize, generate the plan, and then proceed.

## Input Schema
The calling agent must provide:
- `task_goal`: The high-level objective.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
