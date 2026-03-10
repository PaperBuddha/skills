const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = 'http://127.0.0.1:17493';
const PROFILE_ID = 'bb781d02-c42e-4445-b83e-d57b01ebf16e';
const TEMP_DIR = '/tmp/moneypenny_optimized';
const DELAY_MS = 1500;
const TIMEOUT_MS = 30000;

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const text = `Miss Moneypenny, the quintessential secretary to M in the James Bond series, was originally introduced by Ian Fleming in his 1953 novel Casino Royale. In the early cinematic era, Lois Maxwell defined the role for over two decades, appearing in fourteen films alongside Bond actors from Sean Connery to Roger Moore. Her portrayal established the iconic will-they-wont-they dynamic, characterized by witty banter, unrequited affection, and a sharp intelligence that made her an indispensable part of the MI6 furniture, often serving as the emotional grounding for the world's most famous spy.

Following Maxwell's departure, the character underwent several transformations to reflect the changing social landscape of the 1980s and 90s. Caroline Bliss took over during the Timothy Dalton era, presenting a more vulnerable and younger interpretation, while Samantha Bond's tenure alongside Pierce Brosnan introduced a more assertive and professional Moneypenny. This version of the character was notably more capable of handling Bond's flirtations, often delivering cutting remarks that emphasized her status as a career professional within the secret service, proving that she was far more than just a lovelorn assistant waiting by a desk.

The most significant evolution occurred with the casting of Naomie Harris in the Daniel Craig era, starting with Skyfall. This reimagining gave the character a first name, Eve, and a backstory as a field agent who accidentally shoots Bond before transitioning to the desk. This version of Moneypenny is a tactical equal, participating in missions and providing critical field support, effectively dismantling the damsel tropes of the past. Her journey from a combat-ready agent to a senior administrative figure represents the character's full modernization, ensuring she remains a relevant and vital pillar of the Bond franchise for a new generation of audiences.`;

const segments = text.split(/(?<=[.?!;])\s+/).filter(s => s.trim().length > 0);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function synthesizeWithRetry(segment, index) {
    const localClipPath = path.join(TEMP_DIR, `clip_${index}.wav`);
    
    const attempt = async (isRetry = false) => {
        console.log(`${isRetry ? 'Retrying' : 'Generating'} segment ${index + 1}/${segments.length}...`);
        const response = await axios.post(`${API_BASE}/generate`, {
            text: segment,
            profile_id: PROFILE_ID,
            language: "en"
        }, { timeout: TIMEOUT_MS });

        const audioPath = response.data.audio_path;
        fs.copyFileSync(audioPath, localClipPath);
        return localClipPath;
    };

    try {
        return await attempt();
    } catch (err) {
        console.error(`Error on segment ${index}: ${err.message}`);
        if (err.code === 'ECONNABORTED' || err.response?.status === 429 || err.response?.status >= 500) {
            await sleep(DELAY_MS * 2);
            try {
                return await attempt(true);
            } catch (retryErr) {
                console.error(`Retry failed for segment ${index}. Skipping.`);
                return null;
            }
        }
        return null;
    }
}

async function main() {
    const clipPaths = [];
    
    for (let i = 0; i < segments.length; i++) {
        const path = await synthesizeWithRetry(segments[i], i);
        if (path) clipPaths.push(path);
        if (i < segments.length - 1) await sleep(DELAY_MS);
    }

    if (clipPaths.length === 0) {
        console.error("No clips generated.");
        process.exit(1);
    }

    const listFile = path.join(TEMP_DIR, 'clips.txt');
    fs.writeFileSync(listFile, clipPaths.map(p => `file '${p}'`).join('\n'));

    const outputWav = path.join(TEMP_DIR, 'final.wav');
    const outputOgg = path.join(TEMP_DIR, 'moneypenny_history_optimized.ogg');

    console.log("Assembling and Transcoding...");
    execSync(`ffmpeg -y -f concat -safe 0 -i ${listFile} -c copy ${outputWav}`);
    execSync(`ffmpeg -y -i ${outputWav} -c:a libopus -b:a 32k ${outputOgg}`);

    console.log(`COMPLETE:${outputOgg}`);
}

main();
