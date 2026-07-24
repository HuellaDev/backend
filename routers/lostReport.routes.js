import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createLostReport,
  getLostReports,
  getMyLostReports,
  getLostReportById,
  updateLostReportStatus,
  deleteLostReport,
} from "../controllers/lostReport.controller.js";

const router = Router();

router.get("/", getLostReports);
router.get("/mine", [requireAuth], getMyLostReports);
router.get("/:id", getLostReportById);
router.post("/", [requireAuth], createLostReport);
router.patch("/:id/status", [requireAuth], updateLostReportStatus);
router.delete("/:id", [requireAuth], deleteLostReport);

export default router;