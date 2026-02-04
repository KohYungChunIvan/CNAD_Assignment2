import Task from "../models/Task.js";
import User from "../models/User.js";
import { TASK_STATUS } from "../utils/taskStatus.js";
import { createNextTask } from "../services/schedulerService.js";

export async function createTask(req, res) {
  const task = await Task.create(req.body);
  res.status(201).json(task);
}

export async function getAllTasks(req, res) {
  const tasks = await Task.find().populate("assignedTo verifier");
  res.json(tasks);
}

export async function startTask(req, res) {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: TASK_STATUS.PENDING },
    { new: true }
  );
  res.json(task);
}

export async function completeTask(req, res) {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      status: TASK_STATUS.PENDING_VERIFICATION,
      lastCompletedAt: new Date()
    },
    { new: true }
  );
  res.json(task);
}

export async function verifyTask(req, res) {
  const task = await Task.findById(req.params.id);
  task.status = TASK_STATUS.COMPLETED;
  await task.save();

  await createNextTask(task);
  res.json({ message: "Task verified and next instance scheduled" });
}

// Logic to prevent removing compulsory guideline tasks
export async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.isGuideline) {
      return res.status(403).json({ 
        message: "Forbidden: Compulsory guideline tasks cannot be removed." 
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAdminDashboard(req, res) {
  try {
    const dashboardData = await User.aggregate([
      { $match: { role: "PWID" } },
      {
        $lookup: {
          from: "tasks",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$assignedTo", "$$userId"] } } },
            { $sort: { scheduledDate: -1 } },
            { 
              $group: { 
                _id: "$name", 
                status: { $first: "$status" },
                isGuideline: { $first: "$isGuideline" },
                lastUpdated: { $first: "$updatedAt" } 
              } 
            }
          ],
          as: "recentTasks"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "peerId",
          foreignField: "_id",
          as: "peerInfo"
        }
      },
      {
        $project: {
          name: 1,
          unitId: 1,
          peerName: { $arrayElemAt: ["$peerInfo.name", 0] },
          tasks: {
            $arrayToObject: {
              $map: {
                input: "$recentTasks",
                as: "t",
                in: { 
                  k: "$$t._id", 
                  v: { status: "$$t.status", isGuideline: "$$t.isGuideline" } 
                }
              }
            }
          }
        }
      }
    ]);

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}