import express from "express";
import { connectDB } from "./db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

// 👇 THIS LINE IS REQUIRED
app.use("/tasks", taskRoutes);

const PORT = 3001;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Task Service running on port ${PORT}`);
  });
}

startServer();