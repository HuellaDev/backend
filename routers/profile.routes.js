import { Router } from "express";
import { requireAuth, attachProfile } from "../middlewares/auth.middleware.js";
import { getMe, createProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", [requireAuth, attachProfile], getMe);
router.post("/", [requireAuth], createProfile);

export default router;