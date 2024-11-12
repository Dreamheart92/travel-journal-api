import Journal from "../models/Journal.model.js";

import { isValidObjectId } from "mongoose";
import { customResponse } from "../utility/index.js";

export const fetchJournalMiddleware = async (req, res, next) => {

  const { id: journalId } = req.params;

  if (!isValidObjectId(journalId)) {
    return res.status(404).send(customResponse({
      success: false,
      message: "Journal not found"
    }))
  }

  try {
    const journal = await Journal.findById(journalId)
      .populate({ path: "author", select: "username _id imageUrl" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username _id imageUrl"
        }
      })
      .populate("destination")
      .exec();

    if (!journal) {
      return res.status(404).send(customResponse({
        success: false,
        message: "Journal not found"
      }))
    }

    req.journal = journal;
    next();
  } catch (error) {
    next(error);
  }
}
