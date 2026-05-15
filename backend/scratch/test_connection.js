
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = "mongodb+srv://goelectriqevcabs_db_user:GoE12345@cluster0.wcjf5wa.mongodb.net/goelectriq?retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Testing connection with hardcoded URI...");
    await mongoose.connect(uri);
    console.log("✅ Success!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
}

test();
