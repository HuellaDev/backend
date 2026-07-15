import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadPhoto, deletePhoto } from "../controllers/photo.controller.js";

const router = Router();

router.post("/", [requireAuth, upload.single("file")], uploadPhoto);
router.delete("/:id", [requireAuth], deletePhoto);

export default router;