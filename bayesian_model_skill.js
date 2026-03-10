// bayesian_model_skill.js

/**
 * BayesianUpdater Skill
 * A foundational module for probabilistic modeling using a simplified Bayesian updating mechanism.
 * It systematically adjusts a belief (probability) based on new evidence.
 */
class BayesianUpdater {

    /**
     * Updates a prior probability based on new evidence using the log-odds space.
     * This approach is mathematically robust for updating beliefs and ensures the resulting
     * probability remains within the valid range of [0, 1].
     *
     * @param {number} priorProbability - The initial belief about an event, from 0.0 to 1.0.
     *                                    (e.g., current market odds of 0.75).
     * @param {number} evidenceScore - The new piece of evidence, scored from -1.0 (strongly against)
     *                                 to +1.0 (strongly for).
     * @param {number} [evidenceStrength=1.0] - A multiplier for how much impact the evidence has.
     *                                          Lower values lead to more conservative updates.
     * @returns {number} The posterior probability, from 0.0 to 1.0.
     */
    updateBelief(priorProbability, evidenceScore, evidenceStrength = 1.0) {
        // --- Input Validation ---
        if (priorProbability < 0 || priorProbability > 1) {
            throw new Error("priorProbability must be between 0 and 1.");
        }
        if (evidenceScore < -1 || evidenceScore > 1) {
            throw new Error("evidenceScore must be between -1 and 1.");
        }
        if (evidenceStrength <= 0) {
            throw new Error("evidenceStrength must be a positive number.");
        }

        // --- Handle Edge Cases ---
        // If the prior belief is an absolute certainty (0 or 1), no amount of finite evidence can change it.
        if (priorProbability === 0 || priorProbability === 1) {
            return priorProbability;
        }

        // --- 1. Convert Probability to Log-Odds ---
        // The "logit" function maps probability from [0, 1] to the entire real number line [-Infinity, +Infinity].
        // This allows us to perform simple addition/subtraction without worrying about breaking the 0-1 boundary.
        // Odds = p / (1 - p)
        // Log-Odds = log(Odds)
        const priorOdds = priorProbability / (1 - priorProbability);
        const priorLogOdds = Math.log(priorOdds);

        // --- 2. Update the Log-Odds ---
        // The evidenceScore, scaled by its strength, is added directly to the log-odds.
        // Positive evidence increases the log-odds, making the event more likely.
        // Negative evidence decreases it, making the event less likely.
        const posteriorLogOdds = priorLogOdds + (evidenceScore * evidenceStrength);

        // --- 3. Convert Log-Odds back to Probability ---
        // The "inverse logit" (or logistic/sigmoid) function maps the updated log-odds back to the [0, 1] probability space.
        // Odds = e ^ Log-Odds
        // Probability = Odds / (1 + Odds)
        const posteriorOdds = Math.exp(posteriorLogOdds);
        const posteriorProbability = posteriorOdds / (1 + posteriorOdds);

        return posteriorProbability;
    }
}

// Example Usage (for testing purposes)
/*
function main() {
    const updater = new BayesianUpdater();

    console.log("--- Bayesian Updating Demonstrations ---");

    let marketOdds = 0.50; // Start with an uncertain 50/50 market

    // --- Scenario 1: Moderately positive news ---
    let sentiment1 = 0.6; // e.g., a positive news article
    console.log(`\nInitial market odds: ${marketOdds.toFixed(4)}`);
    console.log(`New evidence (sentiment score): ${sentiment1}`);
    marketOdds = updater.updateBelief(marketOdds, sentiment1);
    console.log(`Posterior (updated) odds: ${marketOdds.toFixed(4)}`); // Expected: > 0.50

    // --- Scenario 2: Very negative news with high strength ---
    let sentiment2 = -0.9; // e.g., a major scandal
    let strength2 = 1.5;   // We believe this source is highly credible
    console.log(`\nCurrent market odds: ${marketOdds.toFixed(4)}`);
    console.log(`New evidence (sentiment score): ${sentiment2}, Strength: ${strength2}`);
    marketOdds = updater.updateBelief(marketOdds, sentiment2, strength2);
    console.log(`Posterior (updated) odds: ${marketOdds.toFixed(4)}`); // Expected: << previous value

    // --- Scenario 3: Slightly positive but weak evidence ---
    let sentiment3 = 0.2;
    let strength3 = 0.5;
    console.log(`\nCurrent market odds: ${marketOdds.toFixed(4)}`);
    console.log(`New evidence (sentiment score): ${sentiment3}, Strength: ${strength3}`);
    marketOdds = updater.updateBelief(marketOdds, sentiment3, strength3);
    console.log(`Posterior (updated) odds: ${marketOdds.toFixed(4)}`); // Expected: a small increase
}

// To run this example:
// 1. Save the file.
// 2. Run `node bayesian_model_skill.js`.
// main();
*/

// Export the class to be used as a module.
export default BayesianUpdater;
