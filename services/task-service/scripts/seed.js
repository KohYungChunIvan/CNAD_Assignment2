import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";
import { TASK_STATUS } from "../src/utils/taskStatus.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await User.deleteMany({});
    await Task.deleteMany({});

    const user1 = await User.create({ 
      name: "John Tan", 
      role: "PWID", 
      unitId: "Housing-Unit-01" 
    });
    const user2 = await User.create({ 
      name: "Siti Aminah", 
      role: "PWID", 
      unitId: "Housing-Unit-01" 
    });

    user1.peerId = user2._id;
    user2.peerId = user1._id;
    await user1.save();
    await user2.save();

    const tasks = [
      {
        name: "Morning Hygiene",
        isGuideline: true, // Compulsory
        assignedTo: user1._id,
        verifier: user2._id,
        frequency: "daily",
        scheduledDate: new Date(),
        status: TASK_STATUS.NOT_STARTED
      },
      {
        name: "Laundry Day",
        isGuideline: true, // Compulsory
        assignedTo: user1._id,
        verifier: user2._id,
        frequency: "weekly",
        scheduledDate: new Date(),
        status: TASK_STATUS.NOT_STARTED
      },
      {
        name: "Gardening Hobby",
        isGuideline: false, // Optional/Admin-added
        assignedTo: user1._id,
        verifier: user2._id,
        frequency: "daily",
        scheduledDate: new Date(),
        status: TASK_STATUS.NOT_STARTED
      }
    ];

    await Task.insertMany(tasks);
    console.log("✅ Database seeded with Protected Guideline tasks!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();