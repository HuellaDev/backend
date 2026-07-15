import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createSightingReport,
  getSightingReports,
  getSightingReportById,
  updateSightingReportStatus,
  deleteSightingReport,
} from "../controllers/sightingReport.controller.js";

const router = Router();

router.get("/", getSightingReports);
router.get("/:id", getSightingReportById);
router.post("/", [requireAuth], createSightingReport);
router.patch("/:id/status", [requireAuth], updateSightingReportStatus);
router.delete("/:id", [requireAuth], deleteSightingReport);

export default router;