import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Load env if not already loaded (e.g. when running this file directly)
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
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
      console.error("❌ ERROR: MONGODB_URI/MONGO_URI is not defined in environment variables.");
      console.log("   Available Env Vars (Keys):", Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN') && !k.includes('PASS')));
      
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      return;
    }

    // Obfuscate URI for logging
    const safeUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`🔍 Attempting MongoDB connection: ${safeUri}`);
    
    // Mongoose 7+ defaults to strictQuery: true, but explicitly setting it is good practice
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(uri, {
      dbName: 'goelectriq',
      serverSelectionTimeoutMS: 20000, // Increase timeout for live mode
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      family: 4, // Force IPv4 to avoid potential network issues with some hosting providers
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
    console.error(`❌ CRITICAL ERROR connecting to MongoDB: ${error.name}`);
    console.error(`📝 Message: ${error.message}`);
    
    if (error.name === 'MongoNetworkError') {
      console.error("💡 Hint: This usually means the IP is not whitelisted or the database is unreachable.");
    } else if (error.name === 'MongoParseError') {
      console.error("💡 Hint: Check your connection string format.");
    } else if (error.message.includes('authentication failed')) {
      console.error("💡 Hint: Check your database username and password.");
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.error("💀 Production environment detected. Terminating process to trigger restart.");
      process.exit(1);
    }

    throw error;
  }
};

export default connectDB;
