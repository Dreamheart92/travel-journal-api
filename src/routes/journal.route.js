import { authMiddleware, fetchJournalMiddleware, isAuthMiddleware, isOwnerMiddleware } from "../middleware/index.js";

import {
  createJournalController, deleteJournalController,
  getJournalController, likeJournalController, registerJournalViewController,
  updateJournalController
} from "../controllers/journal.controller.js";
import upload from "../config/multer.config.js";
import express from "express";

const router = express.Router();

router.get('/like/:id', isAuthMiddleware, authMiddleware, fetchJournalMiddleware, likeJournalController);

router.post('/view/:id', fetchJournalMiddleware, registerJournalViewController);

router.get("/:id", fetchJournalMiddleware, getJournalController);

router.post("/", upload.single("image"), isAuthMiddleware, authMiddleware, createJournalController);

router.put("/:id", upload.single("image"), isAuthMiddleware, authMiddleware, fetchJournalMiddleware, isOwnerMiddleware, updateJournalController);

router.delete("/:id", isAuthMiddleware, authMiddleware, fetchJournalMiddleware, isOwnerMiddleware, deleteJournalController);

export default router;
