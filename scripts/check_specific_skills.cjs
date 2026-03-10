const axios = require('axios');
require('dotenv').config();

const API_BASE = 'https://api.a2amarket.live/v1';

async function checkSkills() {
  const ids = [
    'collector-profiling',
    'confidence-scoring',
    'anomaly-detection',
    'data-normalization',
    'wash-trade-detector'
  ];

  for (const id of ids) {
    try {
      console.log(`Checking skill: ${id}...`);
      const res = await axios.get(`${API_BASE}/listings/${id}`);
      console.log(`✅ Found: ${id}`);
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      // Try with skill_ prefix
      try {
        const res = await axios.get(`${API_BASE}/listings/skill_${id.replace(/-/g, '_')}`);
        console.log(`✅ Found (prefixed): ${id}`);
        console.log(JSON.stringify(res.data, null, 2));
      } catch (err2) {
        console.log(`❌ Not found: ${id}`);
      }
    }
  }
}

checkSkills();
