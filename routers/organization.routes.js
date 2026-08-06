import { Router } from "express";

import { attachProfile, requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  getMyOrganization,
  getPendingOrganizations,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller.js";

const router = Router();

// Public routes

router.get("/", getOrganizations);


// Authenticated routes


router.get("/mine", [requireAuth], getMyOrganization);

// Admin routes


router.get("/pending",[
    requireAuth,
    attachProfile,
    requireAdmin
  ],
  getPendingOrganizations);

// Public route


router.get("/:id", getOrganizationById);

router.post("/", [requireAuth], createOrganization);

router.patch("/:id", [
    requireAuth,
    attachProfile,
  ],
updateOrganization);



router.delete("/:id", [
  requireAuth,
  attachProfile
], deleteOrganization);

export default router;