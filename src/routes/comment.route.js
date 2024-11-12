import express from "express";
import {
  createCommentController,
  deleteCommentController,
  likeCommentController, removeLikeCommentController
} from "../controllers/comment.controller.js";
import { authMiddleware, fetchJournalMiddleware, isAuthMiddleware } from "../middleware/index.js";
import { isCommentOwnerMiddleware } from "../middleware/auth/isCommentOwnerMiddleware.js";

const router = express.Router();

router.post("/:id", isAuthMiddleware, authMiddleware, fetchJournalMiddleware, createCommentController);

router.get("/like/:id", isAuthMiddleware, authMiddleware, likeCommentController);

router.delete("/like/:id", isAuthMiddleware, authMiddleware, removeLikeCommentController);

router.get("/dislike/:id", isAuthMiddleware, authMiddleware, likeCommentController);

router.delete("/dislike/:id", isAuthMiddleware, authMiddleware, removeLikeCommentController);

router.delete("/:journalId/:commentId", isAuthMiddleware, authMiddleware, isCommentOwnerMiddleware, deleteCommentController);

export default router;
