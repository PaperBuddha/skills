const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = 'http://127.0.0.1:17493';
const PROFILE_ID = 'bb781d02-c42e-4445-b83e-d57b01ebf16e';
const TEST_WAV = '/tmp/moneypenny_test_sentence.wav';
const TEST_OGG = '/tmp/moneypenny_test_sentence.ogg';

async function main() {
    console.log("Starting single-sentence test...");
    try {
        const response = await axios.post(`${API_BASE}/generate`, {
            text: "Moneypenny reporting for a single sentence test, Paper Buddha.",
            profile_id: PROFILE_ID,
            language: "en"
        }, { timeout: 90000 });

        if (response.data && response.data.audio_path) {
            fs.copyFileSync(response.data.audio_path, TEST_WAV);
            console.log("Success! Transcoding...");
            execSync(`ffmpeg -y -i ${TEST_WAV} -c:a libopus -b:a 32k ${TEST_OGG}`);
            console.log(`COMPLETE:${TEST_OGG}`);
        } else {
            console.error("Invalid response from server.");
        }
    } catch (err) {
        console.error(`Test failed: ${err.message}`);
        process.exit(1);
    }
}

main();
