import {
    createCommentService,
    deleteCommentService,
    likeCommentService,
    removeLikeCommentService
} from "../services/comment.service.js";

export const createCommentController = (req, res, next) => createCommentService(req, res, next);

export const deleteCommentController = (req, res, next) => deleteCommentService(req, res, next);

export const likeCommentController = (req, res, next) => likeCommentService(req, res, next);

export const removeLikeCommentController = (req, res, next) => removeLikeCommentService(req, res, next);