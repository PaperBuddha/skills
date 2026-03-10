const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = 'http://127.0.0.1:17493';
const PROFILE_ID = 'bb781d02-c42e-4445-b83e-d57b01ebf16e';
const TEMP_DIR = '/tmp/moneypenny_history';
const OUTPUT_WAV = path.join(TEMP_DIR, 'final_assembly.wav');
const OUTPUT_OGG = path.join(TEMP_DIR, 'moneypenny_history.ogg');

const text = `Miss Moneypenny, the quintessential secretary to M in the James Bond series, was originally introduced by Ian Fleming in his 1953 novel Casino Royale. In the early cinematic era, Lois Maxwell defined the role for over two decades, appearing in fourteen films alongside Bond actors from Sean Connery to Roger Moore. Her portrayal established the iconic will-they-wont-they dynamic, characterized by witty banter, unrequited affection, and a sharp intelligence that made her an indispensable part of the MI6 furniture, often serving as the emotional grounding for the world's most famous spy. 

Following Maxwell's departure, the character underwent several transformations to reflect the changing social landscape of the 1980s and 90s. Caroline Bliss took over during the Timothy Dalton era, presenting a more vulnerable and younger interpretation, while Samantha Bond's tenure alongside Pierce Brosnan introduced a more assertive and professional Moneypenny. This version of the character was notably more capable of handling Bond's flirtations, often delivering cutting remarks that emphasized her status as a career professional within the secret service, proving that she was far more than just a lovelorn assistant waiting by a desk. 

The most significant evolution occurred with the casting of Naomie Harris in the Daniel Craig era, starting with Skyfall. This reimagining gave the character a first name, Eve, and a backstory as a field agent who accidentally shoots Bond before transitioning to the desk. This version of Moneypenny is a tactical equal, participating in missions and providing critical field support, effectively dismantling the damsel tropes of the past. Her journey from a combat-ready agent to a senior administrative figure represents the character's full modernization, ensuring she remains a relevant and vital pillar of the Bond franchise for a new generation of audiences.`;

// Split by punctuation
const segments = text.split(/(?<=[.?!;])\s+/).filter(s => s.trim().length > 0);

async function generateClips() {
    const clipList = [];
    console.log(`Processing ${segments.length} segments...`);

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i].trim();
        console.log(`Generating segment ${i + 1}/${segments.length}: ${segment.substring(0, 30)}...`);
        
        try {
            const response = await axios.post(`${API_BASE}/generate`, {
                text: segment,
                profile_id: PROFILE_ID,
                language: "en"
            });

            const audioPath = response.data.audio_path;
            const localClipPath = path.join(TEMP_DIR, `clip_${i}.wav`);
            fs.copyFileSync(audioPath, localClipPath);
            clipList.push(localClipPath);
        } catch (err) {
            console.error(`Error on segment ${i}:`, err.message);
            // Retry logic
            try {
                console.log(`Retrying segment ${i}...`);
                const response = await axios.post(`${API_BASE}/generate`, {
                    text: segment,
                    profile_id: PROFILE_ID,
                    language: "en"
                });
                const audioPath = response.data.audio_path;
                const localClipPath = path.join(TEMP_DIR, `clip_${i}.wav`);
                fs.copyFileSync(audioPath, localClipPath);
                clipList.push(localClipPath);
            } catch (retryErr) {
                console.error(`Retry failed for segment ${i}. Skipping.`);
            }
        }
    }
    return clipList;
}

async function main() {
    const clips = await generateClips();
    
    if (clips.length === 0) {
        console.error("No clips generated.");
        process.exit(1);
    }

    // Create concat list
    const listFile = path.join(TEMP_DIR, 'clips.txt');
    const listContent = clips.map(c => `file '${c}'`).join('\n');
    fs.writeFileSync(listFile, listContent);

    // Concat
    console.log("Assembling clips...");
    execSync(`ffmpeg -y -f concat -safe 0 -i ${listFile} -c copy ${OUTPUT_WAV}`);

    // Transcode
    console.log("Transcoding to OGG/Opus...");
    execSync(`ffmpeg -y -i ${OUTPUT_WAV} -c:a libopus -b:a 32k ${OUTPUT_OGG}`);

    console.log(`Success! Final file: ${OUTPUT_OGG}`);
}

main();
