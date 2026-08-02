import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { subscribe, unsubscribe } from "../controllers/push.controller.js";

const router = Router();

router.post("/subscribe", [requireAuth], subscribe);
router.delete("/subscribe", [requireAuth], unsubscribe);

export default router;