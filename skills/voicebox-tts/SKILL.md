---
name: "Voicebox-TTS"
description: "Uses the local Voicebox app (Qwen3-TTS) to generate high-fidelity speech from text."
tags:
- "openclaw-workspace"
- "tts"
- "local-ai"
version: "1.0.0"
---

# Skill: Voicebox TTS

## Purpose
Provides high-quality, local text-to-speech synthesis using the **Voicebox** application. This ensures privacy and utilizes local hardware acceleration (MLX).

## Prerequisites
1.  **App Installed:** Voicebox (by Jamie Pine) must be installed.
2.  **Server Running:** The app must be open, and the API server running on port `8000`.

## Capabilities

### 1. List Voices
See which voice profiles are available for synthesis.
*   **Command**: `node skills/voicebox-tts/scripts/tts_client.js list`

### 2. Speak
Synthesize and play text through system audio.
*   **Command**: `node skills/voicebox-tts/scripts/tts_client.js speak "<text>" [voice_id]`
*   **Arguments**:
    *   `text`: The string to speak.
    *   `voice_id` (Optional): ID of the voice profile. If omitted, uses the first available voice.

## Integration Rules
*   Use this skill when the user asks to "speak", "say", or "read" something.
*   If the connection fails, remind the user to open the Voicebox app.
