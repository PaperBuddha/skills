---
name: context-injection
description: Forces the reading of a local context.md file to load project-specific rules before modifying files.
---

# Context-Injection

## Description
This skill enforces reading a local context.md file at the root of a project directory before any modifications, ensuring project-specific rules, architecture, and history are loaded into the session.

## Usage
Whenever starting a new task or entering a new project directory, the agent must check for a root context.md and load it if present before proceeding with the user's request.

## System Instructions

**PROTOCOL: CONTEXT LOADING**

1.  When starting a new task or entering a new project directory, check for a file named `context.md` at the root path of the project.
2.  If `context.md` exists, read it in full to load project-specific rules, architecture notes, and history.
3.  Acknowledge the loaded rules to the user before proceeding with any further actions.
4.  Proceed with the user's request only after the context has been loaded and acknowledged.

**Note:** If no `context.md` is found, proceed normally and inform the user that no local context was found.

## Input Schema
The calling agent must provide:
- `directory_path`: The path being entered.

## Guardrails
- This skill is functional only; the calling agent supplies all data via the input schema.
