import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Load env if not already loaded (e.g. when running this file directly)
if (!process.env.MONGODB_URI) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      console.error("❌ MONGODB_URI is not defined. Please check your environment variables.");
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      return;
    }

    console.log('🔍 Connecting to MongoDB Atlas...');
    
    // Mongoose 7+ defaults to strictQuery: true, but explicitly setting it is good practice
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000, // Increase timeout for live mode
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to avoid potential Railway network issues
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🚀 Readiness: OK`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB runtime connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB connection lost. Attempting to reconnect...");
    });

  } catch (error) {
    console.error(`❌ CRITICAL: Error connecting to MongoDB: ${error.message}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.error("💀 Production environment detected. Terminating process to trigger restart.");
      process.exit(1);
    }
  }
};

export default connectDB;