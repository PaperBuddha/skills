---
name: "Synaptic-Pruning"
description: "Periodically reviews, deduplicates, and consolidates the agent's long-term memory files to prevent context bloat and resolve conflicting rules."
tags:
- "openclaw-workspace"
- "memory-maintenance"
version: "1.0.0"
---

# Skill: Synaptic Pruning (Memory Consolidation)

## Purpose
Acts as the "garbage collector" for the agent's persistent memory. Over time, `knowledge_index.md` and `lessons_learned.md` accumulate redundant entries and conflicting instructions. This skill consolidates this data into a lean, high-signal format, ensuring the agent's boot sequence remains fast and accurate.

## System Instructions
You are an OpenClaw agent equipped with the Synaptic Pruning protocol. Adhere to the following rules:

1. **Trigger Condition**: Activate this protocol when:
    * The user commands "Consolidate memory" or "Prune knowledge."
    * The `knowledge_index.md` file exceeds 500 lines.
    * You detect contradictory rules in `lessons_learned.md` during a task.

2. **Mandatory Output**: When triggered, you MUST output the heading: `### SYNAPTIC PRUNING INITIATED`.

3. **Core Logic**:
* **Phase A (Backup)**: Before modifying anything, create a timestamped backup of `knowledge_index.md` and `lessons_learned.md` in `memory/backups/`.
* **Phase B (Analysis & Consolidation)**:
    * Read `knowledge_index.md`: Identify duplicate "Knowledge Nuggets" or obsolete project preferences. Merge similar entries into single, robust rules.
    * Read `lessons_learned.md`: Identify repetitive failure patterns. If the same error appears 3+ times, rewrite it as a single, high-priority "Golden Rule" and remove the individual failure logs.
* **Phase C (Archival)**:
    * Move any `memory/YYYY-MM-DD.md` daily logs older than 7 days into a `memory/archive/YYYY/` folder structure to keep the active memory folder clean.
* **Phase D (rewrite)**: Overwrite the active memory files with the consolidated versions.

4. **Safety**:
* Never delete a "Golden Rule" or "Core Takeaway" unless it is explicitly superseded by a newer, more specific one.
* If unsure about merging two items, keep both.

## Integration Rules
* This skill is a maintenance process. It should not be run *during* a critical task, but rather as a standalone operation or at the end of a long session.
* After pruning, trigger `Metacognitive-Reflection` to log the storage optimization metrics (e.g., "Reduced index size by 15%").

## Input Schema
The calling agent must provide:
- `memory_files`: Access to `knowledge_index.md`, `lessons_learned.md`, and the `memory/` directory.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
- Always create a backup before modifying any memory files.
