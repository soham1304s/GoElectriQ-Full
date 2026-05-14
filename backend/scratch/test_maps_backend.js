import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GOOGLE_SERVER_KEY;
console.log('API Key:', apiKey);

async function testBackendMaps() {
  try {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      address: 'Hawa Mahal, Jaipur',
      key: apiKey,
    };

    console.log('Testing Geocoding API...');
    const response = await axios.get(url, { params });
    console.log('Status:', response.data.status);
    if (response.data.status === 'OK') {
      console.log('✅ Geocoding successful!');
      console.log('Address:', response.data.results[0].formatted_address);
    } else {
      console.error('❌ Geocoding failed:', response.data.status);
      if (response.data.error_message) console.error('Error Message:', response.data.error_message);
    }
  } catch (err) {
    console.error('❌ Request error:', err.message);
  }
}

testBackendMaps();
