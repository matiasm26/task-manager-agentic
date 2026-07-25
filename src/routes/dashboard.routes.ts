import { Router } from "express";

import { showDashboard } from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, showDashboard);

export default router;
