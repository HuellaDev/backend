import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createComment, getCommentsForReport, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.get("/", getCommentsForReport);
router.post("/", [requireAuth], createComment);
router.delete("/:id", [requireAuth], deleteComment);

export default router;