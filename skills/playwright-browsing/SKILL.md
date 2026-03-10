---
name: "Playwright-Browsing"
description: "Allows the agent to render and extract readable text from JavaScript-heavy websites using a custom Playwright headless browser."
tags:
- "openclaw-workspace"
- "web-automation"
version: "1.0.0"
---

# Skill: Playwright Browsing

## Purpose
Provides a robust method for fetching content from websites that rely on JavaScript rendering (SPAs, React/Vue apps) or require a real browser context. This skill uses a custom `browse.js` script powered by Playwright.

## System Instructions
You are an OpenClaw agent equipped with the Playwright Browsing protocol. Adhere to the following rules:

1. **Trigger Condition**: Use this skill when the standard `web_fetch` tool fails, returns empty content, or when you specifically need to bypass simple anti-bot mechanisms.

2. **Core Logic**:
* **Command**: Execute the following command in your shell:
  `node tools/playwright-browser/browse.js <URL>`
* **Arguments**: Replace `<URL>` with the target website address (e.g., `https://example.com`).

3. **Output Interpretation**:
* The script will output raw text between `--- START EXTRACTED CONTENT ---` and `--- END EXTRACTED CONTENT ---`.
* Parse this text to answer user queries or extract data.

4. **Error Handling**:
* If the script fails with a timeout or navigation error, consider trying a different URL or falling back to `web_search`.
* Ensure dependencies are installed if the script fails to find `playwright`. Run `npm install` inside `tools/playwright-browser/` if needed.