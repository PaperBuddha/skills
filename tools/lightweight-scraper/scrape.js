const cheerio = require('cheerio');

const url = process.argv[2];

if (!url) {
  console.error("Error: Please provide a URL.");
  process.exit(1);
}

(async () => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.status === 403 || response.status === 401) {
      console.error("ERROR: STATIC_SCRAPE_FAILED - REQUIRES_BROWSER (403 Forbidden)");
      process.exit(1);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $('script, style, nav, header, footer, iframe, noscript').remove();

    const text = $('body').text().replace(/\s+/g, ' ').trim();

    // Check for "suspiciously short" content indicating JS-rendered SPA
    if (text.length < 200 || text.includes("You need to enable JavaScript")) {
      console.error("ERROR: STATIC_SCRAPE_FAILED - REQUIRES_BROWSER (Short/JS Content)");
      process.exit(1);
    }

    console.log("--- START SCRAPED CONTENT ---");
    console.log(text);
    console.log("--- END SCRAPED CONTENT ---");

  } catch (error) {
    console.error(`ERROR: STATIC_SCRAPE_FAILED - REQUIRES_BROWSER (${error.message})`);
    process.exit(1);
  }
})();