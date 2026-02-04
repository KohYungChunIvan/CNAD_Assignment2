import mongoose from "mongoose";

// Define the User schema to manage PWID and Admin profile data
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["PWID", "ADMIN"],
    default: "PWID"
  },
  unitId: {
    type: String,
    required: true
  },
  peerId: {
    type: String // Stores ID of the housemate verification partner
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);