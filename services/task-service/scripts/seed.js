import mongoose from "mongoose";
import dotenv from "dotenv";

// Load the .env from the root folder (3 levels up)
dotenv.config({ path: "../../../.env" });

// Define User Schema locally for seeding purposes
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["PWID", "ADMIN"], default: "PWID" },
  unitId: { type: String, required: true },
  peerId: { type: String }
});
const User = mongoose.model("User", UserSchema);

// Define Task Schema locally for seeding purposes
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTo: { type: String, required: true },
  verifier: { type: String, required: true },
  frequency: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, default: "NOT_STARTED" },
  isGuideline: { type: Boolean, default: false }
});
const Task = mongoose.model("Task", TaskSchema);

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas...");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing data.");

    // 1. Create Users
    const user1 = await User.create({ name: "John Tan", role: "PWID", unitId: "Housing-Unit-01" });
    const user2 = await User.create({ name: "Siti Aminah", role: "PWID", unitId: "Housing-Unit-01" });

    // 2. Link them as peers (using String IDs)
    user1.peerId = user2._id.toString();
    user2.peerId = user1._id.toString();
    await user1.save();
    await user2.save();

    // 3. Create Tasks
    await Task.insertMany([
      {
        name: "Morning Hygiene",
        isGuideline: true,
        assignedTo: user1._id.toString(),
        verifier: user2._id.toString(),
        frequency: "daily",
        scheduledDate: new Date(),
        status: "NOT_STARTED"
      },
      {
        name: "Laundry Day",
        isGuideline: true,
        assignedTo: user1._id.toString(),
        verifier: user2._id.toString(),
        frequency: "weekly",
        scheduledDate: new Date(),
        status: "NOT_STARTED"
      }
    ]);

    console.log("✅ Database seeded successfully with self-contained models!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();