// Import necessary dependencies.
// 'sqlite3' is a standard library for interacting with SQLite databases in Node.js.
// 'crypto' is a built-in Node module used here to generate unique IDs.
import sqlite3 from 'sqlite3';
import { randomUUID } from 'crypto';

// --- Constants ---
const DATABASE_FILE = 'market_intel.db';

/**
 * DataPipeline Skill
 * A resilient class for orchestrating the ingestion and storage of data
 * from web searches into a structured SQLite database.
 */
class DataPipeline {
    /**
     * The constructor initializes the database connection and ensures the
     * necessary table for storing intelligence exists.
     */
    constructor() {
        // Establishes a connection to the SQLite database file.
        // The file is created automatically if it doesn't exist.
        this.db = new sqlite3.Database(DATABASE_FILE, (err) => {
            if (err) {
                console.error("Error connecting to the database:", err.message);
                throw err;
            }
            console.log('Connected to the market_intel.db SQLite database.');
        });

        // Define the SQL schema for our intelligence data.
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS market_intelligence (
                id TEXT PRIMARY KEY,
                event_title TEXT NOT NULL,
                source_url TEXT,
                source_name TEXT,
                published_timestamp TEXT,
                snippet TEXT,
                sentiment_score REAL,
                ingested_at TEXT NOT NULL
            );
        `;

        // Execute the table creation query. 'IF NOT EXISTS' prevents errors on subsequent runs.
        this.db.run(createTableSql, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
                throw err;
            }
        });
    }

    /**
     * 1. Defines the standardized JSON schema for an intelligence record.
     * This method serves as a clear definition and factory for new records.
     * @param {object} data - The data to populate the schema with.
     * @returns {object} A structured JSON object conforming to our standard.
     */
    _createRecordSchema({ title, url, siteName, published, description }) {
        return {
            unique_id: randomUUID(),
            event_title: title,
            data_source: {
                url: url,
                name: siteName,
                published: published
            },
            timestamp: new Date().toISOString(),
            key_text_snippet: description,
            // The sentiment score is initialized to null. It will be populated by the sentiment analysis skill.
            preliminary_sentiment_score: null
        };
    }

    /**
     * 2 & 3. Executes a web search, parses, and transforms the results.
     * This is the core transformation logic, designed to be resilient.
     * @param {Array<object>} searchResults - The raw results array from the web_search tool.
     * @returns {Array<object>} An array of structured records.
     */
    _transform(searchResults = []) {
        if (!Array.isArray(searchResults)) return [];

        const transformedRecords = [];
        for (const result of searchResults) {
            // Gracefully handle potentially missing data using nullish coalescing ('??')
            const record = this._createRecordSchema({
                title: result.title ?? 'No Title Provided',
                url: result.url ?? null,
                siteName: result.siteName ?? 'Unknown Source',
                published: result.published ?? null,
                description: result.description ?? 'No Description Provided'
            });
            transformedRecords.push(record);
        }
        return transformedRecords;
    }

    /**
     * 4. Writes a structured record to the SQLite database.
     * @param {object} record - A single structured data record.
     * @returns {Promise<string>} The ID of the inserted row.
     */
    async _store(record) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO market_intelligence (
                    id, event_title, source_url, source_name, published_timestamp, 
                    snippet, sentiment_score, ingested_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            // Using prepared statements (the '?' syntax) is a critical security measure
            // to prevent SQL injection attacks.
            const params = [
                record.unique_id,
                record.event_title,
                record.data_source.url,
                record.data_source.name,
                record.data_source.published,
                record.key_text_snippet,
                record.preliminary_sentiment_score,
                record.timestamp
            ];

            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error("Database insertion error:", err.message);
                    reject(err);
                } else {
                    // 'this.lastID' is a property of the sqlite3 run callback, giving the ID of the new row.
                    // Since our primary key is a UUID text, we'll return our generated ID.
                    resolve(record.unique_id);
                }
            });
        });
    }

    /**
     * Public method to orchestrate the entire ingestion process.
     * This function would be called by the agent.
     * 
     * @param {string} query - The search query for a specific event or topic.
     * @returns {Promise<Array<string>>} A promise that resolves with the IDs of the ingested records.
     */
    async ingest(query, webSearchFunction) {
        console.log(`Ingesting data for query: "${query}"`);
        
        // Step 2: Execute the search using the provided tool function.
        // In a real scenario, `webSearchFunction` would be the `tools.web_search` call.
        const searchResults = await webSearchFunction({ query: query, count: 5 });

        // Step 3: Transform the unstructured data.
        const structuredRecords = this._transform(searchResults.results);
        console.log(`Transformed ${structuredRecords.length} records.`);

        // Step 4: Store each record in the database.
        const ingestedIds = [];
        for (const record of structuredRecords) {
            const id = await this._store(record);
            ingestedIds.push(id);
        }
        
        console.log(`Successfully ingested ${ingestedIds.length} records into 'market_intel.db'.`);
        return ingestedIds;
    }

    /**
     * Closes the database connection. Should be called when the pipeline is no longer needed.
     */
    close() {
        this.db.close((err) => {
            if (err) {
                console.error("Error closing the database:", err.message);
            }
            console.log('Database connection closed.');
        });
    }
}

// Example Usage (for testing purposes)
/*
async function main() {
    // This is a mock function to simulate the web_search tool for testing.
    const mockWebSearch = async ({ query, count }) => {
        console.log(`Mock search for: "${query}" with ${count} results.`);
        return {
            results: [
                { title: 'Test Article 1', url: 'http://example.com/1', siteName: 'Example News', published: new Date().toISOString(), description: 'This is the first test article.' },
                { title: 'Another Article', url: 'http://example.com/2', description: 'A second article with some missing fields.' }
            ]
        };
    };

    const pipeline = new DataPipeline();
    try {
        const ids = await pipeline.ingest("US election polls", mockWebSearch);
        console.log("Ingested record IDs:", ids);
    } catch (e) {
        console.error("Ingestion process failed:", e);
    } finally {
        pipeline.close();
    }
}

// To run this example:
// 1. Save the file.
// 2. Run `npm install sqlite3`.
// 3. Run `node data_pipeline_skill.js`.
// main();
*/

// Export the class to be used as a module.
export default DataPipeline;
