import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getMyNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", requireAuth, getMyNotifications);
router.patch("/:id/read", requireAuth, markAsRead);
router.delete("/:id", requireAuth, deleteNotification);

export default router;