---
name: "Git-Essentials"
description: "Handles secure GitHub operations (clone, fork, branch, push, PR) for publishing skills and contributing to repos."
tags:
- "openclaw-workspace"
- "git"
- "workflow"
version: "1.1.0"
---

# Skill: Git Essentials

## Purpose
Enables the agent to contribute code to external repositories (like skill registries or awesome lists) securely. It handles authentication via environment variables and isolates operations to temporary directories.

## Security Constraints
1.  **Auth**: Reads `GITHUB_TOKEN` from environment only.
2.  **Isolation**: All clones happen in `/tmp/openclaw-git/`.
3.  **Sanitization**: Error messages are scrubbed of tokens before logging.

## Capabilities

### 1. Setup PR (Single File)
Clones a repo, creates a branch, injects a single file, commits, pushes, and opens a PR.
*   **Command**: `node skills/git-essentials/scripts/git_manager.js setup-pr <repo_url> <branch_name> <target_file_path> <local_content_file> "<commit_message>"`

### 2. Copy Folder & PR (Multi-File)
Recursively copies a local folder into a target repo path and opens a PR.
*   **Command**: `node skills/git-essentials/scripts/git_manager.js copy-folder <repo_url> <branch_name> <source_folder> <dest_path> "<commit_message>" "<pr_title>" "[pr_body]"`

### 3. Clone (Debug)
Clones a repo to temp for inspection.
*   **Command**: `node skills/git-essentials/scripts/git_manager.js clone <repo_url>`
