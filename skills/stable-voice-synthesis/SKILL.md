---
name: "Stable-Moneypenny-Synthesis"
description: "Optimized batch synthesis for the Moneypenny voice with throttled queueing and timeout handling."
tags:
- "openclaw-workspace"
- "tts"
- "performance"
version: "1.1.0"
---

# Skill: Stable-Moneypenny-Synthesis (SMS)

## Purpose
Ensures high-reliability, long-form synthesis for the Moneypenny profile by implementing a throttled request queue and robust error recovery.

## Capabilities

### 1. Throttled Queue
- Process sentences sequentially with a **1.5-second delay** between API requests.
- Prevents `429 Too Many Requests` errors from the Voicebox server.

### 2. Async Pre-processing
- Pre-calculates segment boundaries and prepares the ffmpeg concat list while synthesis is in progress.

### 3. Timeout & Retry Logic
- **Timeout**: 30 seconds per individual sentence request.
- **Retry**: Single-attempt retry on timeout or 5xx error.
- **Skip**: Skip failing chunks after retry to prevent session hangs.

### 4. Audio Buffer Assembly
- Validates all generated `.wav` clips in the local cache before final `ffmpeg` concatenation.
- Final transcode to **OGG/Opus** (32k libopus) for Telegram delivery.

## Integration Rules
- Mandatory for any voice output exceeding 20 words or 3 sentences.
- Use `Moneypenny` profile ID: `bb781d02-c42e-4445-b83e-d57b01ebf16e`.
