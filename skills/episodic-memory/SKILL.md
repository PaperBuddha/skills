# Episodic Memory: Knowledge Indexing

## Objective
Create a fast-loading index of key technical decisions and milestones.

## Trigger
- Weekly (Friday).
- Command: "sync memory", "summarize week", or "update knowledge base".

## Protocol
1.  **Source:** Read `memory/YYYY-MM-DD.md` logs and `transcripts/` for the period.
2.  **Filter:** Extract:
    - Architectural decisions.
    - Solved bugs (root cause + fix).
    - New tool/skill configurations.
3.  **Index:**
    - Create/Update `knowledge_base/index.md`.
    - Create/Update topic-specific files (e.g., `knowledge_base/react_performance.md`).
4.  **Format:**
    - Bullet points.
    - Links to original source files (if available).
    - Tags for searchability.
