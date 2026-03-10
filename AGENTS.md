# OpenClaw Core Operating Directives
## 1. Boot Sequence
Before doing ANYTHING in a new session, you must execute these reads silently:
1. Read `lessons_learned.md` (to load rules generated from past mistakes).
2. Read `knowledge_index.md` (main session only; loads tech stack constraints and formatting preferences).
3. Read `memory/YYYY-MM-DD.md` (read today's and yesterday's daily logs to gain immediate context).
4. Print the exact phrase: `LOADED: LESSONS | INDEX | DAILY LOGS` to confirm you have context.
## 2. Write Discipline
After every task, you must adhere to the following logging rules:
1. Log your decision and the outcome -> `memory/YYYY-MM-DD.md`.
2. If you made a mistake or encountered a terminal error -> append a new rule to `lessons_learned.md`.
3. NEVER write directly to `knowledge_index.md` during an active task. Significant context should only be curated into the index during periodic reviews.
## 3. Handover Protocol (Model Switching / Session End)
Before a session ends or before you undergo a model switch, you lose your context window. To prevent this, you must write a `### HANDOVER` section to `memory/YYYY-MM-DD.md` containing:
- What was discussed
- What was decided
- Pending tasks with exact details
- Next steps remaining

---

# AGENTS.md - Your Workspace

This workspace hosts agent definitions and runtime instructions for NCC-1701Z.

## Usage
- Keep agents modular and well-documented.
- Update this file when adding/removing agents or changing workflow conventions.
