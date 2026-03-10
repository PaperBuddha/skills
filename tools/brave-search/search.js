require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const apiKey = process.env.BRAVE_SEARCH_API_KEY;
const query = process.argv[2];

if (!apiKey) {
  console.error("Error: BRAVE_SEARCH_API_KEY environment variable is missing.");
  process.exit(1);
}

if (!query) {
  console.error("Usage: node search.js \"<query>\"");
  process.exit(1);
}

(async () => {
  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.web?.results || [];

    if (results.length === 0) {
      console.log("No results found.");
      return;
    }

    console.log(`--- SEARCH RESULTS: "${query}" ---`);
    results.forEach((result, index) => {
      console.log(`\n[${index + 1}] ${result.title}`);
      console.log(`    URL: ${result.url}`);
      console.log(`    Snippet: ${result.description}`);
    });
    console.log("\n--- END OF RESULTS ---");

  } catch (error) {
    console.error("Search failed:", error.message);
    process.exit(1);
  }
})();