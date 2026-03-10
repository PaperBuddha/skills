# Proactive Scan: Ship Hygiene

## Objective
Maintain a clean and efficient workspace.

## Trigger
Command: "scan the ship" or "system diagnostic".

## Protocol
1.  **Scan Targets:**
    - **Dead Files:** Empty files, temp files (`.tmp`, `.bak`), or orphaned configs.
    - **Logs:** `logs/` or `transcripts/` files older than 7 days.
    - **Dependencies:** `node_modules` size, `package.json` vs `lockfile` sync (if applicable).
    - **Git Status:** Uncommitted changes or untracked files.

2.  **Report:**
    - List detected issues.
    - Categorize by severity (Low/Medium/High).

3.  **Proposal:**
    - Offer a single `cleanup.sh` script or a series of commands to resolve all issues.
    - Wait for user confirmation before deleting anything.
