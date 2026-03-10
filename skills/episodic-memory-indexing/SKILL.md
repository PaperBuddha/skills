---
name: episodic-memory-indexing
description: Summarizes long project threads into searchable Knowledge Nuggets to optimize long-term memory and prune conversational fluff.
tags:
- "openclaw-workspace"
- "memory-management"
- "efficiency"
version: "1.0.0"
---

# Skill: Episodic Memory Indexing

## Purpose
This skill is designed to combat context bloat and improve reasoning efficiency by autonomously summarizing extended conversational segments and tool outputs into concise "Knowledge Nuggets." These nuggets are then stored in a dedicated `memory/episodic_memory_index.md` file, providing a searchable, high-signal reference for future sessions without requiring the loading of full chat histories.

## System Instructions
You are an OpenClaw agent equipped with the Episodic Memory Indexing protocol. You must adhere to the following rules strictly:

1.  **Trigger Condition**: This skill will be invoked proactively by `agent-resource-manager` or manually by the user when context size exceeds thresholds (e.g., >30,000 tokens input) or after a significant task completion.

2.  **Phase 1: Segment Identification**:
    *   Identify a logical "episode" within the recent conversation history. An episode typically covers a single sub-task or problem-solving sequence.
    *   Extract all relevant user prompts, agent responses, and tool outputs pertaining to this episode.

3.  **Phase 2: Knowledge Nugget Generation**:
    *   **Summarization**: Condense the extracted episode into 1-3 concise "Knowledge Nuggets." Each nugget should capture a key decision, outcome, or learned lesson from that episode.
    *   **Format**: Each nugget must be formatted as follows:
        ```
        ### Knowledge Nugget: [Concise Title]
        - **Context**: [Brief overview of the problem/task]
        - **Decision/Outcome**: [What was decided or achieved]
        - **Key Learnings**: [Any significant insights, new rules, or optimizations]
        - **Source Session**: [Session ID/Timestamp] (for traceability)
        ```
    *   **Storage**: Store these nuggets in `memory/episodic_memory_index.md`. If the file does not exist, create it. **Always append** new nuggets to the end of the file to preserve history.

4.  **Phase 3: Context Pruning**:
    *   After successful indexing, mark the summarized conversational segment as "processed" and recommend purging it from the active session history if appropriate (e.g., by starting a new session or explicitly clearing old turns).

5.  **Guardrails**:
    *   **Non-Redundant**: Avoid creating duplicate nuggets. Prioritize unique information.
    *   **Concise**: Nuggets must be brief and high-signal, never exceeding 5 sentences total per nugget.
    *   **Traceability**: Ensure `Source Session` is always included.

## Example Workflow:
> Agent detects context bloat after a file refactor.
>
> Agent:
> ### EPISODIC MEMORY INDEXING INITIATED
> Summarizing recent conversation for `episodic_memory_index.md`...
>
> ### Knowledge Nugget: Workspace Bloat Resolution
> - **Context**: Addressed excessive `node_modules` size in `a2a-market`, `git-essentials`, and `voicebox-tts`.
> - **Decision/Outcome**: Implemented aggressive file pruning (removed `src`, `docs`, `*.js.map`, `tests`, `examples`, `.github` folders). Reduced total bloat from ~36MB to ~7.3MB.
> - **Key Learnings**: Aggressive pruning is effective but limited; deep optimization requires code refactoring or alternative dependency management.
> - **Source Session**: [Timestamp/Session ID]
>
> Episodic memory updated. Context is now ready for further pruning.

## Input Schema
The calling agent must provide:
- `session_history`: The conversational episode to summarize.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
