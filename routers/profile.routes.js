import { Router } from "express";
import { requireAuth, attachProfile } from "../middlewares/auth.middleware.js";
import { getMe } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", [requireAuth, attachProfile], getMe);

export default router;