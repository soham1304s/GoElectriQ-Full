import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GOOGLE_SERVER_KEY;
console.log('API Key:', apiKey);

async function testAllApis() {
  const apis = [
    { name: 'Geocoding', url: 'https://maps.googleapis.com/maps/api/geocode/json', params: { address: 'Jaipur', key: apiKey } },
    { name: 'Distance Matrix', url: 'https://maps.googleapis.com/maps/api/distancematrix/json', params: { origins: 'Jaipur', destinations: 'Delhi', key: apiKey } },
    { name: 'Places Autocomplete', url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json', params: { input: 'Jaipur', key: apiKey } }
  ];

  for (const api of apis) {
    try {
      console.log(`\nTesting ${api.name} API...`);
      const response = await axios.get(api.url, { params: api.params });
      console.log('Status:', response.data.status);
      if (response.data.status === 'OK') {
        console.log(`✅ ${api.name} successful!`);
      } else {
        console.error(`❌ ${api.name} failed:`, response.data.status);
        if (response.data.error_message) console.error('Error Message:', response.data.error_message);
      }
    } catch (err) {
      console.error(`❌ ${api.name} request error:`, err.message);
    }
  }
}

testAllApis();
