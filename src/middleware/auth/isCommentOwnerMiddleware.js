import Comment from "../../models/Comment.model.js";
import { customResponse } from "../../utility/index.js";
import { isValidObjectId } from "mongoose";

export const isCommentOwnerMiddleware = async (req, res, next) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    return res.status(404).send(customResponse({
      success: false,
      message: "Comment not found",
      data: null
    }))
  }

  const comment = await Comment.findById({ _id: commentId });

  if (!comment) {
    return res.status(404).send(customResponse({
      success: false,
      message: "Comment not found"
    }))
  }

  const isCommentOwner = comment.author.equals(req.userId);

  if (isCommentOwner) {
    next();
  } else {
    res.status(401).send(customResponse({
      success: false,
      message: "Not authorized"
    }))
  }
}
