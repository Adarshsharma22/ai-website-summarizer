import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createSummary,
  getSummaries,
  deleteSummary,
} from "../controllers/summaryController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createSummary);
router.get("/", getSummaries);
router.delete("/:id", deleteSummary);

export default router;
