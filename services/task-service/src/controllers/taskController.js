import Task from "../models/Task.js";
import { TASK_STATUS } from "../utils/taskStatus.js";
import { createNextTask } from "../services/schedulerService.js";
import axios from "axios";

// Controller function to create a new task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task); // Respond with the newly created task
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller function to retrieve all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks); // Respond with the list of tasks
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).send("Error retrieving tasks");
  }
};

// Controller function to mark a task as in-progress
const startTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: TASK_STATUS.PENDING },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to submit a task for verification
const completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: TASK_STATUS.PENDING_VERIFICATION,
        lastCompletedAt: new Date()
      },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to verify a task and trigger the next instance
const verifyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.status = TASK_STATUS.COMPLETED;
    await task.save();

    // Event-driven: create the next instance automatically
    await createNextTask(task);
    res.json({ message: "Task verified and next instance scheduled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a task with guideline protection
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Protection logic for compulsory MINDS guidelines
    if (task.isGuideline) {
      return res.status(403).json({ 
        message: "Forbidden: Compulsory guideline tasks cannot be removed." 
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to aggregate dashboard data across services
const getAdminDashboard = async (req, res) => {
  try {
    // 1. Fetch all user data from the User Service via Axios 
    // We use the Docker service name 'user-service' as the hostname
    const userRes = await axios.get("http://user-service:3002/users");
    
    // 2. Filter the retrieved users to get only those with the "PWID" role
    const pwids = userRes.data.filter(u => u.role === "PWID");

    // 3. Map through the PWIDs to gather their specific tasks and peer info
    const dashboardData = await Promise.all(pwids.map(async (user) => {
      
      // Find all tasks in the Task Database where assignedTo matches this User's ID string
      // We sort by scheduledDate descending to see the latest tasks first
      const recentTasks = await Task.find({ assignedTo: user._id.toString() })
                                    .sort({ scheduledDate: -1 });

      // Find the Peer's name by looking up the peerId within the pwids list we already fetched
      const peer = pwids.find(p => p._id.toString() === user.peerId);

      // Return the combined object for this specific PWID
      return {
        name: user.name,
        unitId: user.unitId,
        peerName: peer ? peer.name : "N/A",
        tasks: recentTasks
      };
    }));

    // 4. Respond with the fully aggregated dashboard data
    res.json(dashboardData);

  } catch (error) {
    // Log any errors (like connection issues between services) and respond with 500
    console.error("Dashboard Aggregation Error:", error);
    res.status(500).json({ 
      message: "Error aggregating dashboard data from microservices",
      error: error.message 
    });
  }
};

export {
  createTask,
  getAllTasks,
  startTask,
  completeTask,
  verifyTask,
  deleteTask,
  getAdminDashboard
};