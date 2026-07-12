import { Router } from "express";
import { testDB, testMatches } from "../controllers/test.controller.js";

const router = Router();

router.get("/", testDB);
router.get("/matches", testMatches);

export default router;