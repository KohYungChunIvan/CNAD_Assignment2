import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["PWID", "CARETAKER"],
    required: true
  },
  // Added for Admin Dashboard grouping
  unitId: {
    type: String, 
    required: true // e.g., "Unit-A", "Unit-B"
  },
  // Link to the peer PWID who verifies their tasks
  peerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);