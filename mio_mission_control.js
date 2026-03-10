// mio_mission_control.js

// This script integrates our specialized skills into a single operational workflow.
import DataPipeline from './data_pipeline_skill.js';
import PoliticalSentimentAnalyzer from './sentiment_analyzer_skill.js';
import BayesianUpdater from './bayesian_model_skill.js';
import sqlite3 from 'sqlite3';

const DATABASE_FILE = 'market_intel.db';

/**
 * MIO Mission Control
 * Orchestrates the data gathering, analysis, and forecasting process
 * to generate a high-confidence trade signal.
 */
class MIOMissionControl {
    /**
     * Initializes all the necessary skills for the mission.
     */
    constructor() {
        this.pipeline = new DataPipeline();
        this.analyzer = new PoliticalSentimentAnalyzer();
        this.updater = new BayesianUpdater();
        // A direct DB connection is needed to read the data ingested by the pipeline.
        this.db = new sqlite3.Database(DATABASE_FILE);
    }

    /**
     * Retrieves all intelligence snippets for a given topic from the database.
     * In a production system, this would be enhanced to only pull unprocessed records.
     * @param {string} eventTitleQuery - A query string to find relevant records.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of records.
     */
    async _retrieveIntelligence(eventTitleQuery) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT snippet FROM market_intelligence WHERE event_title LIKE ?;`;
            // Using '%' allows for wildcard searching.
            const params = [`%${eventTitleQuery}%`];

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error("Error retrieving intelligence:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Executes a full mission for a given market.
     * @param {object} params - The mission parameters.
     * @param {string} params.marketTopic - The topic to search for (e.g., "US election polls").
     * @param {number} params.initialOdds - The starting probability (0.0 to 1.0) of the 'YES' outcome.
     * @param {number} params.confidenceThreshold - The probability needed to generate a signal (e.g., 0.75 for 75%).
     * @param {Function} params.webSearchFunction - The actual web_search tool function.
     * @returns {Promise<object|null>} A trade signal object, or null if no signal is generated.
     */
    async executeMission(params) {
        const { marketTopic, initialOdds, confidenceThreshold, webSearchFunction } = params;

        console.log(`--- MIO Mission Start: ${marketTopic} ---`);
        console.log(`Initial Odds: ${initialOdds}, Confidence Threshold: ${confidenceThreshold}`);

        // 1. DATA INGESTION: Use the DataPipeline to gather raw data.
        await this.pipeline.ingest(marketTopic, webSearchFunction);
        console.log("Ingestion complete. Retrieving intelligence for analysis...");

        // 2. DATA RETRIEVAL: Get the newly ingested data from the database.
        const intelligenceSnippets = await this._retrieveIntelligence(marketTopic);
        if (intelligenceSnippets.length === 0) {
            console.log("No relevant intelligence found for this topic. Mission aborted.");
            return null;
        }
        console.log(`Retrieved ${intelligenceSnippets.length} snippets for analysis.`);

        // 3. ANALYSIS & FORECASTING: Loop through evidence and update belief.
        let currentOdds = initialOdds;
        for (const intel of intelligenceSnippets) {
            // Use the SentimentAnalyzer to score the text snippet.
            const sentimentScore = this.analyzer.analyze(intel.snippet);

            // Use the BayesianUpdater to update our belief based on the new evidence.
            const previousOdds = currentOdds;
            currentOdds = this.updater.updateBelief(currentOdds, sentimentScore);

            console.log(`- Snippet analyzed. Sentiment: ${sentimentScore.toFixed(3)}. Odds updated: ${previousOdds.toFixed(4)} -> ${currentOdds.toFixed(4)}`);
        }

        console.log(`\nFinal calculated odds: ${currentOdds.toFixed(4)}`);

        // 4. SIGNAL GENERATION: Check if the final odds meet our confidence threshold.
        if (currentOdds >= confidenceThreshold) {
            const signal = {
                action: 'BUY_YES',
                market: marketTopic,
                confidence: currentOdds,
                justification: `Final probability of ${currentOdds.toFixed(4)} exceeds threshold of ${confidenceThreshold}.`
            };
            console.log("--- High Confidence Signal Generated ---", signal);
            return signal;
        } else if ((1 - currentOdds) >= confidenceThreshold) {
            const signal = {
                action: 'BUY_NO',
                market: marketTopic,
                confidence: (1 - currentOdds),
                justification: `Final probability of NO outcome (${(1 - currentOdds).toFixed(4)}) exceeds threshold of ${confidenceThreshold}.`
            };
            console.log("--- High Confidence Signal Generated ---", signal);
            return signal;
        } else {
            console.log("--- No High Confidence Signal Generated. Standing by. ---");
            return null;
        }
    }

    /**
     * Closes all underlying connections.
     */
    close() {
        this.pipeline.close(); // This closes the DB connection used for writing.
        // The read connection is closed automatically by the sqlite3 library in this script's context.
    }
}

// Example Usage (for testing purposes)
/*
async function main() {
    // Mock the web search tool for a predictable test.
    const mockWebSearch = async ({ query }) => {
        return {
            results: [
                { title: query, description: 'Recent reports indicate a major bipartisan agreement is imminent, signaling growth.' },
                { title: query, description: 'Despite some pessimistic outlooks, the overall trend shows successful reform.' },
                { title: query, description: 'A minor scandal has slightly complicated the issue, but optimists remain.' },
                { title: query, description: 'There is strong support for the initiative.' }
            ]
        };
    };

    const missionControl = new MIOMissionControl();
    try {
        const signal = await missionControl.executeMission({
            marketTopic: "Will the bill pass?",
            initialOdds: 0.50, // Start from a neutral 50%
            confidenceThreshold: 0.80, // We need to be 80% sure
            webSearchFunction: mockWebSearch
        });

        if (signal) {
            console.log("\nFinal Mission Output:", signal);
        } else {
            console.log("\nFinal Mission Output: No trade signal met the criteria.");
        }
    } catch (e) {
        console.error("Mission failed:", e);
    } finally {
        missionControl.close();
    }
}

// To run this example:
// 1. Run `npm install sqlite3` if you haven't already.
// 2. Run `node mio_mission_control.js`.
// main();
*/

// Export the class to be used as a module.
export default MIOMissionControl;
