const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

const uri = process.env.MONGODB_URI;
console.log('Connecting to:', uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'MONGODB_URI is not set');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
