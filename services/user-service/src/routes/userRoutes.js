import express from "express";
import * as userCtrl from "../controllers/userController.js";

const router = express.Router();

router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getUserById);

export default router;