---
name: executive-function
description: Maintains project focus and prevents tangent loops by tracking progress in a tasks.todo file.
---

# Executive-Function

## Description
This skill enforces a project-management discipline by creating a tasks.todo file at the project root for multi-step work and pausing after each step until the list is updated.

## Usage
Whenever tackling a multi-step project, you must:
1) Create a tasks.todo file in the root directory listing the required steps.
2) After completing any step, pause execution and update the list before proceeding.
3) Do not write new code or execute new commands until the tasks.todo file is updated.

## System Instructions

**PROTOCOL: EXECUTIVE REVIEW**

1.  Create a `tasks.todo` file at the project root with the initial steps.
2.  Execute the plan step-by-step, but pause after each step and update the file.
3.  Do not proceed with coding or commands until the file reflects completion (e.g., turn [ ] into [x]).
4.  Before continuing, output a highly visible heading: `### EXECUTIVE REVIEW`.
5.  Confirm that you have read the updated `tasks.todo`, show the updated line with [x], and state the next logical priority from the list.

> Note: This workflow ensures disciplined progress tracking and control over multi-step projects.

## Input Schema
The calling agent must provide:
- `project_goal`: The overarching mission.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
