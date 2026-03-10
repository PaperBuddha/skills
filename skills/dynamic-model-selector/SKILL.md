---
name: dynamic-model-selector
description: Dynamically selects the most cost-effective AI model based on task complexity and available API credits, preventing manual switching and optimizing token usage.
tags:
- "openclaw-workspace"
- "efficiency"
- "cost-management"
- "model-orchestration"
version: "1.0.0"
---

# Skill: Dynamic Model Selector

## Purpose
This skill provides autonomous model routing, eliminating the need for manual model switching. It dynamically selects the optimal AI model for each task based on perceived complexity, current API credit availability, and TPM limits, ensuring cost-efficiency and preventing rate limit exhaustion.

## System Instructions
You are an OpenClaw agent equipped with the Dynamic Model Selector protocol. You must adhere to the following rules strictly:

1.  **Trigger Condition**: This skill will be invoked before any task that requires model inference, or when the `agent-resource-manager` detects impending TPM limits or high costs.

2.  **Phase 1: Task Complexity Analysis**:
    *   Evaluate the incoming task or query for complexity.
    *   Assign a preliminary complexity score or category (e.g., "simple," "moderate," "complex," "image-analysis," "code-generation").

3.  **Phase 2: Resource Availability Check**:
    *   Query `session_status` for current model usage, API credit status (if available), and active TPM limits for all configured models.
    *   Prioritize models with available credits and sufficient TPM headroom.

4.  **Phase 3: Model Selection Logic**:
    *   **Default (Low Cost)**: For "simple" or "moderate" tasks, and when TPM limits are a concern, default to `google/gemini-2.5-flash-preview` or `moonshot/kimi-k2.5` (if fully available and cost-effective).
    *   **High Reasoning (Conditional)**: For "complex" tasks, only select models like `google/gemini-3-pro-preview` or `anthropic/claude-opus-4-5` if:
        *   API credits are confirmed sufficient.
        *   Current TPM usage is well below limits.
        *   The task explicitly requires advanced reasoning (e.g., multi-step problem solving, nuanced interpretation).
    *   **Image Analysis**: For "image-analysis" tasks, only select image-capable models if API credits are explicitly confirmed as available for that model.
    *   **Fallback**: If the primary selected model fails due to rate limits or errors, automatically attempt to fall back to the next most suitable model (e.g., from `Gemini 3 Pro` to `Gemini 2.5 Flash`).

5.  **Phase 4: Model Application**:
    *   Execute the current task using the selected model.
    *   Log the selected model and reasoning in `memory/YYYY-MM-DD.md`.

6.  **Guardrails**:
    *   **Never Exceed Limits**: Always prioritize staying within configured API limits.
    *   **User Override**: If the user explicitly specifies a model, this skill will defer to the user's choice.
    *   **Transparency**: Always report the model selected and the reason for its selection (e.g., "Using `Gemini 2.5 Flash` for efficiency due to moderate complexity and current TPM concerns").

### Usage
To use this skill, the system or another agent should invoke it by running the `select_model.py` script with the task description as an argument. This skill dynamically assesses the task and current resource state to select the most appropriate model, then logs the decision.

```bash
# Example invocation
python skills/dynamic-model-selector/scripts/select_model.py "Summarize a 50-page research paper with detailed analysis"
```

## Input Schema
The calling agent must provide:
- `task_description`: The query to be routed.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
