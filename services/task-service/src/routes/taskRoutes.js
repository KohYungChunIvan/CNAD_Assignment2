import express from "express";
import * as taskCtrl from "../controllers/taskController.js";

const router = express.Router();

router.get("/admin/dashboard", taskCtrl.getAdminDashboard);
router.get("/", taskCtrl.getAllTasks);
router.post("/", taskCtrl.createTask);
router.patch("/:id/start", taskCtrl.startTask);
router.patch("/:id/complete", taskCtrl.completeTask);
router.patch("/:id/verify", taskCtrl.verifyTask);
router.delete("/:id", taskCtrl.deleteTask); // Added delete route

export default router;