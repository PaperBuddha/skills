---
name: tree-of-thoughts
description: Forces divergent brainstorming by generating three distinct architectural approaches before implementation.
---

# Tree-of-Thoughts

## Description
This skill forces divergent brainstorming by generating three distinct architectural approaches before implementation.

## Usage
When asked to solve a complex architectural problem, design a new feature, or write a significant script, DO NOT default to a single solution or begin coding immediately. Instead, output a highly visible `### TREE OF THOUGHTS` heading. Under this heading, generate three distinctly different technical approaches to the problem (Approach A, B, C).

For each approach, list Pros and Cons. Then pause and ask the user which path to pursue before proceeding. Do not write final code or execute commands until the user selects a path.

## Input Schema
The calling agent must provide:
- `task`: The complex problem, architectural design goal, or decision point requiring divergent brainstorming.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
- Do not proceed with final implementation until the user has explicitly selected one of the proposed paths.
