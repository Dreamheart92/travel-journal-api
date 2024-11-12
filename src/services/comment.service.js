import Comment from "../models/Comment.model.js";
import { customResponse } from "../utility/index.js";
import User from "../models/User.model.js";
import Journal from '../models/Journal.model.js';

export const createCommentService = async (req, res, next) => {
  const { comment: content, createdAt } = req.body;

  try {
    const comment = await Comment.create(
      {
        author: req.userId,
        comment: content,
        createdAt
      });

    req.journal.comments.push(comment);
    req.journal.commentsCount++;
    await req.journal.save();

    comment.author = await User.findById({ _id: req.userId }).select("username _id imageUrl");

    res.status(201).send(customResponse({
      success: true,
      message: "Comment created",
      data: comment
    }))
  } catch (error) {
    next(error);
  }
}

export const deleteCommentService = async (req, res, next) => {
  const { commentId, journalId } = req.params;

  try {
    await Comment.findOneAndDelete({ _id: commentId });
    const journal = await Journal.findById(journalId);

    const commentIndex = journal.comments.findIndex((comment) => String(comment) === commentId);

    journal.comments.splice(commentIndex, 1);
    journal.commentsCount--;

    await journal.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

const removeLike = async (comment, collection, userId) => {
  const likeIndex = comment[collection].findIndex(like => {
    return like.equals(userId);
  });

  if (likeIndex !== -1) {
    comment[collection].splice(likeIndex, 1);
    await comment.save();
  }
}

export const likeCommentService = async (req, res, next) => {
  const { id: commentId } = req.params;

  const collections = {
    likes: "likes",
    dislikes: "dislikes"
  }

  const collection = req.path.includes("dislike") ? collections.dislikes : collections.likes;
  const oppositeCollection = collection === collections.likes ? collections.dislikes : collections.likes;

  try {
    const comment = await Comment.findById({ _id: commentId });

    if (!comment[collection].includes(req.userId)) {
      comment[collection].push(req.userId);
      await removeLike(comment, oppositeCollection, req.userId);
      await comment.save();

      return res.status(201).send(customResponse({
        success: true,
        message: null,
        data: null
      }))
    }

    res.send({
      success: false,
      message: "User already liked this comment",
      data: null
    })

  } catch (error) {
    next(error);
  }
}

export const removeLikeCommentService = async (req, res, next) => {
  const { id: commentId } = req.params;

  const collections = {
    likes: "likes",
    dislikes: "dislikes"
  }

  const collection = req.path.includes("dislike") ? collections.dislikes : collections.likes;

  try {
    const comment = await Comment.findById({ _id: commentId });
    await removeLike(comment, collection, req.userId);
    res.status(204).send();

  } catch (error) {
    next(error);
  }
}
