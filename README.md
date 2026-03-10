# OpenClaw Brain Pack

> A curated collection of 21 core cognitive, debugging, and meta-skills designed to upgrade baseline agent intelligence.

**Author:** Paper Buddha | NCC-1701Z

## What is this?
Most OpenClaw skills provide external capabilities (like web searching or GitHub access). The Brain Pack provides **internal capabilities**. 

It injects a cognitive architecture into your agent, granting it the ability to plan deliberately, self-correct before executing destructive commands, manage its own context window, dynamically select models, and autonomously prune its own memory to prevent bloat.

## The 21 Capabilities

The Brain Pack is divided into six logical layers:

### 1. The Auditing & Review Layer
*   `Pre-Publish-Audit`: A mandatory security and integrity gate before publishing code or skills.
*   `Metacognitive-Reflection`: Forces a post-task analysis (`### POST-GAME ANALYSIS`) to evaluate logic, tool efficiency, and write optimizations to persistent memory.
*   `reflexion-engine`: A pre-execution critique loop. Forces the agent to act as a senior reviewer on its own code before execution.

### 2. The Planning & Guardrail Layer
*   `plan-first-act-second`: Enforces a "measure twice, cut once" workflow (`### PLANNING PHASE`) before running shell commands or modifying files.
*   `tree-of-thoughts`: Forces divergent brainstorming (generating 3 distinct approaches) before executing complex architecture.
*   `hallucination-triage`: Forces the agent to score its confidence (0-100) before proposing a solution. If <80, it halts and asks the human for guidance.

### 3. The Debugging & Correction Layer
*   `rubber-duck-debugging`: Triggers a mandatory halt if a command fails. The agent cannot blindly retry; it must analyze logs and propose a fix first (`### DEBUGGING PHASE`).
*   `recursive-self-correction`: Enforces a Chain of Verification (`### VERIFICATION PHASE`) where the agent must explicitly question if previous outputs (paths/variables) are correct before using them.
*   `self-correction`: A lighter variant of Chain of Verification for variable and path integrity.
*   `circuit-breaker`: The ultimate kill-switch. If the agent fails a shell command/script 3 times in a row, it forces a hard stop and demands human intervention (`### [CIRCUIT BREAKER TRIPPED]`).

### 4. The Memory Management Layer
*   `Synaptic-Pruning`: A garbage collector for long-term memory. It backs up, analyzes, and condenses `knowledge_index.md` and `lessons_learned.md`.
*   `episodic-memory-indexing`: Summarizes long threads into "Knowledge Nuggets" to prevent context bloat.
*   `memory-bank`: Automatically logs user preferences, complex bug fixes, and project milestones to persistent files.

### 5. The Context & Project Management Layer
*   `Context-Loading`: Silently reads `knowledge_index.md` at the start of a session to adopt formatting preferences and architectural constraints.
*   `context-injection`: Automatically loads project-specific rules from a local `context.md` file when entering a new directory.
*   `context-compactor`: When a session gets too long, it writes a summary of the project state to `active_state.md`, which becomes the new source of truth.
*   `executive-function`: For multi-step projects, forces the creation of a `tasks.todo` file and pauses after every step (`### EXECUTIVE REVIEW`).

### 6. The Meta & Routing Layer
*   `alignment-engine`: Implements "Dynamic Persona Scaling." Adjusts reasoning depth based on user urgency (skips deep planning for urgent fixes, engages Tree-of-Thoughts for strategic requests).
*   `autonomous-delegation`: Allows the agent to spawn specialized sub-agents via `sessions_spawn` for highly complex or isolating tasks.
*   `dynamic-model-selector`: Dynamically selects the most cost-effective AI model based on task complexity to save API budget.
*   `Recursive-Self-Improvement`: Allows the agent to write and deploy its own `SKILL.md` files when it hits repetitive roadblocks or missing tools.

## Installation

This installer is built securely using native Bash file operations (`mkdir`, `cp`, `rm`). It clones this repository into a temporary directory and drops the skills directly into your OpenClaw workspace.

### macOS / Linux (Terminal)
Run these three commands to pull the installer, make it executable, and run it:

```bash
curl -O https://raw.githubusercontent.com/PaperBuddha/skills/main/install-brain.sh
chmod +x install-brain.sh
./install-brain.sh
```

*(No OpenClaw restart is required. Skills become active immediately.)*