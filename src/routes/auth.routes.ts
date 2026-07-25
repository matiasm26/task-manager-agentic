import { Router } from "express";

import { loginUser, logoutUser, registerUser, showLoginForm, showRegisterForm } from "../controllers/auth.controller";
import { redirectAuthenticated, requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/register", redirectAuthenticated, showRegisterForm);
router.post("/register", redirectAuthenticated, registerUser);
router.get("/login", redirectAuthenticated, showLoginForm);
router.post("/login", redirectAuthenticated, loginUser);
router.post("/logout", requireAuth, logoutUser);

export default router;
