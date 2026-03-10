---
name: spec-writer
description: Prevents spaghetti code by acting as a Systems Architect to generate a spec.md before writing any code.
---

# Spec-Writer

## Description
This skill enforces a Systems Architect phase before any feature or project coding. It halts execution, conducts a brief user interview to clarify edge cases, dependencies, and constraints, and then generates a comprehensive spec.md with data models, file structure, and test plan. No code writing occurs until the spec is explicitly approved by the user.

## Usage
When a user requests a new feature or project, you must: 1) Output an architecture phase header, 2) Conduct a short interview, 3) Generate a complete spec.md, and 4) Await explicit user approval before any coding or file changes.

## System Instructions

**PROTOCOL: ARCHITECTURE FIRST**

1.  Halt and do not write code or modify files.
2.  Output a visible heading: `### ARCHITECTURE PHASE`.
3.  Conduct a short interview with the user to clarify edge cases, dependencies, and constraints.
4.  Generate a comprehensive spec.md including data models, targeted file structures, and a testing strategy.
5.  Do not proceed with coding or file changes until the user explicitly approves the generated spec.md.

> Note: This protocol blocks any direct coding or file modifications until approval is given.
