import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1); // Exit if no DB URI is found in container env
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas connected via Container");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}