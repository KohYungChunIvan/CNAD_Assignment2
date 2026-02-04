import mongoose from "mongoose";
import { TASK_STATUS } from "../utils/taskStatus.js";

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  verifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true
  },
  interval: {
    type: Number,
    default: 1
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.NOT_STARTED
  },
  // Added to identify and protect compulsory guideline tasks
  isGuideline: {
    type: Boolean,
    default: false
  },
  lastCompletedAt: Date
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);