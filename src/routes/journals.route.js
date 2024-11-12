import express from "express";

import {
  authMiddleware,
  isAuthMiddleware,
  queryMiddleware
} from "../middleware/index.js";

import {
  getJournalsController, getUserJournalsController,

} from "../controllers/journal.controller.js";

const router = express.Router();

router.get("/user/:id", isAuthMiddleware, authMiddleware, getUserJournalsController);
router.get("/:destination?", queryMiddleware, getJournalsController);

export default router;
