const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const API_BASE = process.env.VOICEBOX_URL || 'http://127.0.0.1:17493';
const TEMP_AUDIO_FILE = path.join(__dirname, 'temp_speech.wav');

// Helper to play audio on Mac
function playAudio(filePath) {
  return new Promise((resolve, reject) => {
    exec(`afplay "${filePath}"`, (error) => {
      if (error) {
        console.error("Audio playback failed:", error);
        // Don't reject, just log, so the script finishes gracefully
        resolve(); 
      } else {
        resolve();
      }
    });
  });
}

async function checkServer() {
  try {
    await axios.get(`${API_BASE}/docs`); // Check if docs load
    return true;
  } catch (e) {
    return false;
  }
}

async function listVoices() {
  try {
    const res = await axios.get(`${API_BASE}/profiles`);
    if (res.data.length === 0) {
      console.log("No voices found. Create a voice profile in the Voicebox app first.");
      return;
    }
    console.log("Available Voices:");
    res.data.forEach(v => {
      console.log(`- [${v.id}] ${v.name} (${v.language})`);
    });
    return res.data;
  } catch (err) {
    console.error("Failed to list voices:", err.message);
  }
}

async function speak(text, voiceId) {
  try {
    // If no voice provided, fetch the first one
    if (!voiceId) {
      const voices = await axios.get(`${API_BASE}/profiles`);
      if (voices.data.length > 0) {
        voiceId = voices.data[0].id;
        console.log(`Using default voice: ${voices.data[0].name}`);
      } else {
        console.error("Error: No voice profiles available in Voicebox.");
        process.exit(1);
      }
    }

    console.log(`Generating speech... ("${text.substring(0, 30)}...")`);
    
    // Voicebox Generate API
    // Endpoint: POST /generate
    // Body: { text, profile_id, language }
    const response = await axios.post(`${API_BASE}/generate`, {
      text: text,
      profile_id: voiceId,
      language: "en" // Defaulting to English for now
    }, {
      responseType: 'arraybuffer' // Expecting audio binary
    });

    // Write file
    const audioData = JSON.parse(response.data.toString());
    const actualAudioPath = audioData.audio_path;
    console.log(`Audio generated at: ${actualAudioPath}. Playing...`);

    // Play
    await playAudio(actualAudioPath);
    console.log("Done.");

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error("Error: Voicebox is not running. Please start the Voicebox app.");
    } else {
      console.error("TTS Failed:", err.message);
      if (err.response) console.error("API Response:", err.response.status);
    }
    process.exit(1);
  }
}

async function main() {
  const isUp = await checkServer();
  if (!isUp) {
    console.error("Error: Voicebox server not detected at http://localhost:8000");
    console.error("Please launch the Voicebox app and ensure the API server is enabled.");
    process.exit(1);
  }

  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];

  switch (command) {
    case 'list':
      await listVoices();
      break;
    case 'speak':
      // usage: node tts_client.js speak "Hello world" [voice_id]
      await speak(arg1, arg2);
      break;
    default:
      console.log("Usage: node tts_client.js [list|speak]");
  }
}

main();
