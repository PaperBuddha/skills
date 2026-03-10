---
name: "Lightweight-Scraper"
description: "Allows the agent to perform fast, static HTML scraping using Cheerio. This tool is faster than Playwright but fails on JS-rendered sites."
tags:
- "openclaw-workspace"
- "web-automation"
version: "1.0.0"
---

# Skill: Lightweight Scraper (Static HTML)

## Purpose
Acts as the **Tier 2** web access tool. It is significantly faster and less resource-intensive than Playwright but only works on static HTML pages. It bridges the gap between search snippets (Tier 1) and full browser automation (Tier 3).

## System Instructions
You are an OpenClaw agent equipped with the Lightweight Scraper protocol. Adhere to the following rules:

1. **Trigger Condition**: Use this skill when:
    * You have a specific URL (from search results or user input) and need full page content.
    * The site appears static (e.g., Wikipedia, blogs, documentation).

2. **Core Logic**:
* **Command**: Execute the following command in your shell:
  `node tools/lightweight-scraper/scrape.js <URL>`
* **Arguments**: Replace `<URL>` with the target website address.

3. **Output Interpretation**:
* **Success**: The script outputs `--- START SCRAPED CONTENT ---` followed by clean text.
* **Failure (Escalation)**: If the script outputs `ERROR: STATIC_SCRAPE_FAILED - REQUIRES_BROWSER`, you MUST immediately escalate to the **Playwright-Browsing** skill for that URL. Do not report failure to the user; seamlessly switch tools.

4. **Integration Rules**:
* This tool is automatically chained from `Brave-Search`. If Brave snippets are insufficient, try this first. If this fails, try Playwright.