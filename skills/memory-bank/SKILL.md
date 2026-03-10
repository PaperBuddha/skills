---
name: memory-bank
description: Maintains persistent memory across sessions by logging user preferences and project milestones.
---

# Memory-Bank

## Description
This skill ensures continuity across sessions by automatically logging key learnings, user preferences, and project milestones to a persistent file. It prevents knowledge loss between session restarts and builds a cumulative record of decisions and discoveries.

## Usage
This skill is active at all times. It triggers automatically whenever the agent learns a new user preference, solves a complex bug, or completes a major project milestone.

## Prerequisites

**MANDATORY: Before First Entry**

Before attempting to append any entry to the memory bank, you must verify the following:

1.  Check if the directory `~/openclaw_memory/` exists.
    *   If it does **not** exist, create it: `mkdir -p ~/openclaw_memory`
2.  Check if the file `~/openclaw_memory/learned_lessons.md` exists.
    *   If it does **not** exist, create it with the following header:
        ```
        # Learned Lessons
        Persistent memory bank for user preferences, solved bugs, and project milestones.
        ```

Only after confirming both the directory and file exist may you proceed with appending entries.

## System Instructions

**PROTOCOL: AUTOMATIC MEMORY LOGGING**

Whenever ANY of the following events occur, you must append a new entry to `~/openclaw_memory/learned_lessons.md`:

### Trigger Events

1.  **New User Preference Discovered**
    *   The user expresses a preference for a tool, workflow, formatting style, communication style, naming convention, or any other operational detail.
    *   Example: "I prefer tabs over spaces," "Always use `trash` instead of `rm`," "Don't use markdown tables in Discord."

2.  **Complex Bug Successfully Resolved**
    *   A non-trivial debugging session concludes with a confirmed fix.
    *   The root cause and solution are worth preserving to avoid repeating the investigation.

3.  **Major Project Milestone Completed**
    *   A significant deliverable is finished: a feature shipped, a deployment completed, a migration executed, a skill created, etc.

### Entry Format

Each entry must be appended as a concise, bulleted summary using the following structure:

```markdown
## [YYYY-MM-DD] — <Short Title>
- **Category:** Preference | Bug Fix | Milestone
- **Summary:** <One to two sentence description of what was learned or accomplished.>
- **Details:** <Any relevant specifics: file paths, commands, configuration values, root causes, etc.>
```

### Execution Sequence

1.  **Detect Trigger:** Recognize that a trigger event has occurred.
2.  **Verify Prerequisites:** Ensure `~/openclaw_memory/` and `~/openclaw_memory/learned_lessons.md` exist (create if missing).
3.  **Compose Entry:** Draft the bulleted summary following the format above.
4.  **Append to File:** Append the entry to the end of `~/openclaw_memory/learned_lessons.md`.
5.  **Confirm:** Briefly acknowledge in the chat that the memory bank has been updated.

### Example

> Agent successfully resolves a permission error during a deployment.
>
> Agent appends to `~/openclaw_memory/learned_lessons.md`:
> ```markdown
> ## 2026-02-23 — Deployment Permission Fix
> - **Category:** Bug Fix
> - **Summary:** Deployment script failed due to incorrect file ownership on `/var/www/app`.
> - **Details:** Root cause was `chown` not applied after artifact extraction. Fixed by adding `chown -R deploy:deploy /var/www/app` to the post-deploy hook in `deploy.sh`.
> ```
>
> Agent says: "Memory bank updated with the deployment permission fix."

**Constraint:**
If you realize after the fact that a trigger event occurred and you did not log it, go back and append the entry immediately. Continuity depends on completeness.

## Input Schema
The calling agent must provide:
- `event_details`: The milestone, preference, or bug fix to log.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
