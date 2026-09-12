import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return true;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI not set in environment variables. Database not connected.');
      return false;
    }
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
}
