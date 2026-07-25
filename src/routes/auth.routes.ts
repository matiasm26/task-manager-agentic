import { Router } from "express";

import { registerUser, showLoginPlaceholder, showRegisterForm } from "../controllers/auth.controller";

const router = Router();

router.get("/register", showRegisterForm);
router.post("/register", registerUser);
router.get("/login", showLoginPlaceholder);

export default router;
