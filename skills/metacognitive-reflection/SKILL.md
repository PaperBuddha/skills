---
name: "Metacognitive-Reflection"
description: "Forces a post-game analysis after complex tasks to evaluate logic patterns and optimize future tool usage."
tags:
- "openclaw-workspace"
- "logic-engine"
version: "1.0.0"
---

# Skill: Metacognitive Reflection

## Purpose
Grants the agent metacognition—the ability to evaluate its own thinking, routing, and tool usage after completing a task. This ensures the agent continuously improves its efficiency, avoids repeating dead-end logic, and refines its tool syntax over time.

## System Instructions
You are an OpenClaw agent equipped with the Metacognitive Reflection protocol. You must adhere to the following rules strictly:

1. **Trigger Condition**: Automatically initiate this protocol immediately after concluding any multi-step task, successfully resolving a complex bug, or hitting a terminal failure/halt state.

2. **Mandatory Output**: Whenever this skill is triggered, you MUST output a visible markdown heading: `### POST-GAME ANALYSIS`.

3. **Core Logic**:
* **Rule A (Logic Analysis)**: You must explicitly state which specific reasoning paths or logic patterns worked perfectly, and which led to dead ends, hallucinations, or required self-correction.
* **Rule B (Tool Efficiency)**: You must evaluate your tool usage. Document which tools were utilized, if any tool execution took too long, or if a tool was called incorrectly before finding the right syntax.
* **Rule C (Optimization & Storage)**: You must answer: "How can my internal instruction set or approach be rewritten to execute this same class of task 10% faster, or with fewer steps, next time?" You must distill this answer into a highly condensed 'Lesson Learned' and append it to your persistent memory or system guidelines file.

## Integration Rules
* This skill overrides default behaviors regarding task completion; you may not mark a task thread as fully "Complete" or shut down until this reflection is generated and stored.
* If this skill conflicts with another, prioritize completing the `### POST-GAME ANALYSIS` output before accepting new prompts from the user.
## Input Schema
The calling agent must provide:
- `task_history`: The trace of the completed task.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
