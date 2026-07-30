import { Router } from "express";
import { requireAuth, attachProfile } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getMe,
  createProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", [requireAuth, attachProfile], getMe);
router.post("/", [requireAuth], createProfile);
router.patch("/me", [requireAuth], updateProfile);
router.post("/me/photo", [requireAuth, upload.single("file")], uploadProfilePhoto);

export default router;