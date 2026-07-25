import { Router } from "express";

import { createTask } from "../controllers/task.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createTask);

export default router;
