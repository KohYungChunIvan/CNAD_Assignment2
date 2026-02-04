import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import userRoutes from "./routes/userRoutes.js"; // Import the routes

dotenv.config(); 
const app = express();
app.use(express.json());

connectDB();

// Use the routes
app.use("/users", userRoutes);

const PORT = process.env.USER_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});