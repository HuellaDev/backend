import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller.js";

const router = Router();

router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", [requireAuth], createOrganization);
router.patch("/:id", [requireAuth], updateOrganization);
router.delete("/:id", [requireAuth], deleteOrganization);

export default router;