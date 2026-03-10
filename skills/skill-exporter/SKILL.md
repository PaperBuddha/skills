---
name: "Skill-Exporter"
description: "Orchestrates the secure packaging, pricing, and publishing of skills to the ClawHub registry."
tags:
- "openclaw-workspace"
- "workflow"
- "release-engineering"
version: "1.1.0"
---

# Skill: Skill Exporter

## Purpose
A release engineering pipeline that enforces security audits before any skill code leaves the workspace. It automates packaging, metadata mapping, and direct publication to the ClawHub registry using the `clawhub` CLI.

## System Instructions
You are an OpenClaw agent equipped with the Skill Exporter protocol. Adhere to the following rules strictly:

1. **Trigger Condition**: Activate this skill when instructed to "export," "publish," or "sync" a local skill folder to the ClawHub registry.

2. **Phase 1: Security & Branding Audit (Pre-Flight)**
    *   **Action**: Scan the target skill folder using the `Security-Audit` skill.
    *   **Rule**: Block export if any hardcoded secrets (API keys, private keys) are found.
    *   **Rule**: Remove any internal project branding (e.g., "Artledger") from the `SKILL.md` and metadata before export, unless the user explicitly overrides.
    *   **Rule**: Ensure the `SKILL.md` contains the required metadata block (`name`, `description`, `version`, `tags`).

3. **Phase 2: Registry Publication (Execution)**
    *   **Command**: Use `clawhub publish <path>`.
    *   **Metadata**: Map local `SKILL.md` metadata to `clawhub publish` flags:
        *   `--slug`: Derived from the folder name.
        *   `--name`: From metadata `name`.
        *   `--version`: From metadata `version`.
        *   `--changelog`: Ask the user for a changelog or generate one from git history.
    *   **Verification**: Run `clawhub whoami` before publishing to ensure the session is authenticated.

4. **Phase 3: Documentation & Verification**
    *   **Action**: Log the successful publication to `memory/YYYY-MM-DD.md`.
    *   **Action**: Provide the user with the confirmation slug and version.

5. **Guardrails**:
    *   **Authentication**: If `clawhub whoami` fails, do not attempt to publish. Instruct the user to run `clawhub login`.
    *   **Confidentiality**: Never export skills marked as `STRICTLY PRIVATE` in the `knowledge_index.md`.
    *   **Validation**: If `SKILL.md` is missing or metadata is incomplete, fail the export and report the missing fields.
    *   **Non-Destructive**: Do not delete the local skill folder after export.
