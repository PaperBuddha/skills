// sentiment_analyzer_skill.js

/**
 * PoliticalSentimentAnalyzer Skill
 * A self-contained module for analyzing the sentiment of political text without external APIs.
 * It uses a keyword-based approach with positive, negative, and modifier dictionaries.
 */
class PoliticalSentimentAnalyzer {
    constructor() {
        // 1. Dictionaries for sentiment analysis.
        // Using Maps for potentially faster lookups compared to plain objects.

        // Positive keywords suggest favorable outcomes or stability.
        this.positiveWords = new Map([
            ['bipartisan', 1], ['agreement', 1], ['growth', 1], ['stability', 1],
            ['peace', 1], ['reform', 1], ['innovation', 1], ['opportunity', 1],
            ['prosperity', 1], ['successful', 1], ['breakthrough', 1], ['support', 1],
            ['pass', 1], ['approve', 1], ['optimistic', 1], ['stabilize', 1]
        ]);

        // Negative keywords suggest unfavorable outcomes or instability.
        this.negativeWords = new Map([
            ['scandal', -1], ['gridlock', -1], ['recession', -1], ['crisis', -1],
            ['corruption', -1], ['unemployment', -1], ['debt', -1], ['protest', -1],
            ['disaster', -1], ['conflict', -1], ['veto', -1], ['block', -1],
            ['reject', -1], ['pessimistic', -1], ['turmoil', -1], ['unrest', -1]
        ]);

        // Modifier keywords change the weight of the word that follows them.
        this.modifiers = new Map([
            // Negations flip the sentiment entirely.
            ['not', -1], ['never', -1], ['no', -1], ['without', -1],

            // Amplifiers increase the sentiment's magnitude.
            ['highly', 2], ['very', 2], ['extremely', 2], ['significantly', 2],
            ['major', 1.5], ['strong', 1.5],

            // Diminishers reduce the sentiment's magnitude.
            ['slightly', 0.5], ['partially', 0.5], ['somewhat', 0.5], ['minor', 0.5],
            ['barely', 0.25]
        ]);
    }

    /**
     * 2, 3, 4. Analyzes the input text and returns a normalized sentiment score.
     * @param {string} text - The text to analyze.
     * @returns {number} A sentiment score between -1.0 and +1.0.
     */
    analyze(text) {
        if (!text || typeof text !== 'string') {
            return 0;
        }

        // Pre-process the text: make it lowercase, remove simple punctuation, and split into words.
        const tokens = text
            .toLowerCase()
            .replace(/[.,!?;:()]/g, '')
            .split(/\s+/);

        let totalScore = 0;
        let scoredTokensCount = 0;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let score = 0;

            if (this.positiveWords.has(token)) {
                score = this.positiveWords.get(token);
            } else if (this.negativeWords.has(token)) {
                score = this.negativeWords.get(token);
            } else {
                // If the word is not a sentiment word, skip to the next token.
                continue;
            }

            scoredTokensCount++;

            // 3. Check for a modifier in the preceding word.
            if (i > 0) {
                const precedingToken = tokens[i - 1];
                if (this.modifiers.has(precedingToken)) {
                    // Apply the modifier's multiplier to the current word's score.
                    score *= this.modifiers.get(precedingToken);
                }
            }

            totalScore += score;
        }

        // 4. Normalize the score.
        // We divide the total score by the count of words that were actually scored.
        // This prevents longer texts from having artificially inflated scores.
        // The result is clamped between -1.0 and 1.0 to ensure a consistent range.
        if (scoredTokensCount === 0) {
            return 0;
        }

        const normalizedScore = totalScore / scoredTokensCount;

        // Clamp the score to the range [-1, 1] as an extra safeguard.
        return Math.max(-1, Math.min(1, normalizedScore));
    }
}

// Example Usage (for testing purposes)
/*
function main() {
    const analyzer = new PoliticalSentimentAnalyzer();

    const textsToTest = [
        "The new bill is expected to pass, signaling a period of growth and stability.", // Positive
        "BREAKING: A major scandal threatens to create political gridlock and turmoil.", // Negative
        "The agreement was not successful.", // Negated Positive -> Negative
        "The crisis was somewhat contained.", // Diminished Negative -> Less Negative
        "This is a very optimistic development.", // Amplified Positive -> Very Positive
        "A neutral statement about the weather." // Neutral
    ];

    textsToTest.forEach(text => {
        const score = analyzer.analyze(text);
        console.log(`[${score.toFixed(3)}] - "${text}"`);
    });
}

// To run this example:
// 1. Save the file.
// 2. Run `node sentiment_analyzer_skill.js`.
// main();
*/

// Export the class to be used as a module.
export default PoliticalSentimentAnalyzer;
