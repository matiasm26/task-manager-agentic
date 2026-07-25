import { Router } from "express";

import { createTask, deleteTask, showEditTaskForm, updateTask } from "../controllers/task.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id/edit", requireAuth, showEditTaskForm);
router.post("/:id", requireAuth, updateTask);
router.post("/:id/delete", requireAuth, deleteTask);
router.post("/", requireAuth, createTask);

export default router;
