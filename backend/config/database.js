import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Load env if not already loaded
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Global cache for serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ ERROR: MONGODB_URI is not defined.");
    if (process.env.NODE_ENV === 'production') process.exit(1);
    return;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    
    // On Vercel, we must await the connection before any model operation
    mongoose.set('bufferCommands', false);

    const opts = {
      dbName: 'goelectriq',
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      family: 4,
    };

    console.log(`🔍 Connecting to MongoDB (Serverless Mode)...`);
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`✅ MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`❌ MongoDB Connection Error: ${e.message}`);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
