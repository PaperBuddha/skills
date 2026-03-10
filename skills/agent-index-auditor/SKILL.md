---
name: "agent-index-auditor"
description: "Audits the consistency between local skill source code and the remote ClawHub/A2A registry to detect missing, misattributed, or stale versions."
tags:
- "openclaw-workspace"
- "devops"
- "audit"
version: "1.0.0"
---

# Skill: Index Auditor

## Purpose
Ensures that all published skills are correctly indexed on the registry and owned by the correct identity. It identifies discrepancies that may occur during migrations or API failures.

## System Instructions
1. **Local Inventory**: Scan the `/Users/openclaw/.openclaw/ncc1701z/workspace/skills/` directory for folders containing a `SKILL.md`.
2. **Registry Scan**: Use `clawhub search` or `clawhub inspect` for each local skill slug.
3. **Discrepancy Table**:
   | Local Skill | Registry Status | Version Match | Owner Match |
   | :--- | :--- | :--- | :--- |
   | [Slug] | ✅/❌ | ✅/❌ | ✅/❌ |
4. **Action Items**:
   - If missing: Recommend `Skill-Exporter` run.
   - If owner mismatch: Flag as critical identity error.
   - If version mismatch: Recommend sync.

## Guardrails
- **Read-Only**: This skill only reports discrepancies; it does not push updates without a separate `export` command.
