---
name: "Brave-Search"
description: "Allows the agent to perform fast, API-based web searches using the Brave Search API. Use this tool for general queries, fact-checking, and news retrieval."
tags:
- "openclaw-workspace"
- "web-search"
version: "1.1.0"
---

# Skill: Brave Search (API)

## Purpose
Provides a lightweight, API-driven web search capability. This skill is superior to raw browser scraping for general information retrieval, fact-checking, and news updates as it avoids CAPTCHAs and returns structured data.

## System Instructions
You are an OpenClaw agent equipped with the Brave Search protocol. Adhere to the following rules:

1. **Trigger Condition**: Use this skill when the user asks a factual question, requests current news, or when you need to verify information from the web.

2. **Core Logic**:
* **Command**: Execute the following command in your shell:
  `BRAVE_SEARCH_API_KEY=<your-key> node tools/brave-search/search.js "<query>"`
* **Arguments**: Replace `<query>` with the search term (e.g., `purple cats`).
* **Environment**: Ensure the `BRAVE_SEARCH_API_KEY` is set. If not present in the environment, prompt the user to provide it or load it from a secure `.env` file.

3. **Output Interpretation**:
* The script will output structured search results (Title, URL, Snippet).
* Parse these results to formulate your answer. If the snippets are insufficient, use the `Playwright-Browsing` skill or `web_fetch` to visit the URLs directly.

4. **Error Handling**:
* If the API returns a 401/403 error, the API key is likely invalid or missing.
* If no results are found, try broadening the query.

## Integration Rules
* **Fallback Protocol:** If the `brave-search` API returns snippets that lack sufficient detail to answer the user's prompt, or if you need to read the full content of a specific URL returned in the search results, you MUST trigger this tool chain automatically:
    1.  **Tier 2 (Lightweight Scraper):** Attempt to scrape the URL using `node tools/lightweight-scraper/scrape.js <URL>`.
    2.  **Tier 3 (Playwright Browsing):** If the lightweight scraper fails (prints `ERROR: STATIC_SCRAPE_FAILED - REQUIRES_BROWSER`), immediately escalate to the `Playwright-Browsing` skill for that URL.
    Do not ask for permission; execute this sequence autonomously.