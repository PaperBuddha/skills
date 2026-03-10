const { chromium } = require('playwright-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth')();

// Apply the stealth plugin to playwright-extra
chromium.use(stealthPlugin);

const url = process.argv[2];

if (!url) {
  console.error("Error: Please provide a URL.");
  process.exit(1);
}

(async () => {
  try {
    // Launch browser with stealth settings
    const browser = await chromium.launch({
      headless: true, // Stealth plugin works best with headless: false, but true is often required for server environments.
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled', // Mask automation features
        '--window-size=1920,1080',
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      javaScriptEnabled: true,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();

    console.log(`Navigating to: ${url}`);
    
    // Navigate with a slightly longer timeout for heavy pages
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Wait for dynamic content to settle (simulating human read time)
    await page.waitForTimeout(3000);

    // Extract visible text from the body
    const content = await page.evaluate(() => document.body.innerText);
    
    console.log("--- START EXTRACTED CONTENT ---");
    console.log(content);
    console.log("--- END EXTRACTED CONTENT ---");

    await browser.close();
  } catch (error) {
    console.error(`Error browsing ${url}:`, error.message);
    process.exit(1);
  }
})();