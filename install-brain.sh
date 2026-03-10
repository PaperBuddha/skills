#!/usr/bin/env bash
#
# install-brain.sh
# OpenClaw Cognitive Architecture (Brain Pack) Installer
# Author: Paper Buddha | NCC-1701Z
#
# This script securely clones the OpenClaw "Brain Pack" (a curated set of
# cognitive, debugging, and meta-skills) directly into the current
# profile's workspace skills directory.
#
# No opaque binaries. No hidden curl pipes. 100% declarative file operations.

set -e

REPO_URL="https://github.com/PaperBuddha/skills.git"
CLONE_DIR=$(mktemp -d -t openclaw-brain-install-XXXXXX)
# Dynamically determine the target directory based on where OpenClaw runs this script,
# or default to the standard workspace path if run manually.
TARGET_DIR="${OPENCLAW_WORKSPACE_DIR:-$HOME/.openclaw/default/workspace}/skills"

echo "============================================================"
echo "🧠 INITIATING OPENCLAW BRAIN PACK INSTALLATION"
echo "============================================================"
echo "Target Workspace: $TARGET_DIR"

# Ensure target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating target skills directory..."
    mkdir -p "$TARGET_DIR"
fi

# Clone the repository
echo "Cloning payload from $REPO_URL..."
git clone --depth 1 -b openclaw-brain-pack --quiet "$REPO_URL" "$CLONE_DIR"

# Define the verified Brain Pack manifest
declare -a BRAIN_SKILLS=(
    "tree-of-thoughts"
    "Synaptic-Pruning"
    "self-correction"
    "rubber-duck-debugging"
    "reflexion-engine"
    "Recursive-Self-Improvement"
    "recursive-self-correction"
    "Pre-Publish-Audit"
    "plan-first-act-second"
    "Metacognitive-Reflection"
    "memory-bank"
    "hallucination-triage"
    "executive-function"
    "episodic-memory-indexing"
    "dynamic-model-selector"
    "Context-Loading"
    "context-injection"
    "context-compactor"
    "circuit-breaker"
    "autonomous-delegation"
    "alignment-engine"
)

echo "Installing verified cognitive skills..."
for skill in "${BRAIN_SKILLS[@]}"; do
    if [ -d "$CLONE_DIR/$skill" ]; then
        # Remove existing skill if it exists to overwrite
        if [ -d "$TARGET_DIR/$skill" ]; then
            rm -rf "$TARGET_DIR/$skill"
        fi
        
        # Copy the new skill
        cp -R "$CLONE_DIR/$skill" "$TARGET_DIR/"
        echo "  ✔️ Installed: $skill"
    else
        echo "  ⚠️ Warning: $skill not found in remote repository."
    fi
done

# Cleanup
echo "Cleaning up temporary files..."
rm -rf "$CLONE_DIR"

echo "============================================================"
echo "✅ INSTALLATION COMPLETE"
echo "============================================================"
echo "Your OpenClaw instance is now equipped with the Brain Pack."
echo "Changes will take effect immediately. No restart required."