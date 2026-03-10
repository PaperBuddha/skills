---
name: context-compactor
description: Prevents logic degradation by summarizing and compacting long conversation history into a temporary active_state.md file.
---

# Context-Compactor

## Description
This skill prevents logic degradation during long or complex sessions by mandating a proactive pause to summarize the current project state into a temporary `active_state.md` file. Once created, this file becomes the primary source of truth for the session, replacing reliance on deep chat history recall.

## Usage
This skill activates automatically when a coding session becomes heavily extended, terminal logs pile up, or immediately before starting a massive code refactor. It can also be invoked manually by the user at any time.

## System Instructions

**PROTOCOL: CONTEXT COMPACTION**

### Trigger Conditions

You must proactively invoke this protocol when ANY of the following conditions are met:

1.  **Extended Session:** The conversation has grown long with many tool calls, file edits, and command outputs accumulating in history.
2.  **Log Pile-Up:** Multiple rounds of terminal output, build logs, or test results have been generated, making it difficult to track the current state from chat history alone.
3.  **Pre-Refactor:** You are about to begin a large-scale code refactor, migration, or multi-file restructuring.

### Execution Sequence

1.  **Halt Execution:** Pause all current work. Do not proceed with the next command or edit.
2.  **Output a `### CONTEXT COMPACTION` Heading:** You must output a visible `### CONTEXT COMPACTION` section in your response.
3.  **Summarize Current State:** Under this heading, write a concise summary covering all four of the following elements:
    *   **Overarching Goal:** What is the high-level objective of the current task or project?
    *   **Completed Steps:** What has been done so far? List key actions, files modified, and commands executed.
    *   **Known Bugs / Issues:** What problems have been identified but not yet resolved?
    *   **Immediate Next Steps:** What are the next 3–5 concrete actions to take?
4.  **Write to `active_state.md`:** Write this summary to a file named `active_state.md` in the root of the current working directory. If the file already exists, overwrite it with the updated state.
5.  **Acknowledge Transition:** Inform the user that context has been compacted and that `active_state.md` is now the primary reference.

### Post-Compaction Rule

**Once `active_state.md` has been created, you must treat it as your primary source of truth for the current context.** Do not attempt to recall details from deep chat history. If you need to verify something, read `active_state.md` first.

When the task is fully complete, inform the user that `active_state.md` can be safely deleted or archived.

**Example of Required Workflow:**

> Session has been running for 45 minutes with 20+ tool calls.
>
> Agent:
> ### CONTEXT COMPACTION
> Writing current state to `active_state.md`...
>
> - **Overarching Goal:** Build a CLI tool that converts CSV files to JSON with schema validation.
> - **Completed Steps:**
>   - Created project structure with `cli.py`, `converter.py`, `schema.py`.
>   - Implemented CSV parsing with `pathlib`-based file handling.
>   - Added `--output` flag to CLI argument parser.
> - **Known Bugs:**
>   - Schema validation silently drops rows with missing required fields instead of raising an error.
> - **Immediate Next Steps:**
>   1. Fix schema validation to raise `ValueError` on missing required fields.
>   2. Add unit tests for the converter module.
>   3. Write a `README.md` with usage examples.
>
> Context compacted. `active_state.md` is now my primary reference for this session.

**Constraint:**
If you catch yourself struggling to recall what was done earlier in a long session, **STOP**. Invoke this protocol immediately rather than guessing or hallucinating prior context.

## Input Schema
The calling agent must provide:
- `session_context`: The current project state and logs.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
