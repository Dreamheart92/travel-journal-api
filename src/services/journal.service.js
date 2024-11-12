import Journal from "../models/Journal.model.js";
import Destination from "../models/Destination.model.js";

import { isValidObjectId } from "mongoose";
import { customResponse } from "../utility/index.js";
import cloudinary from "../config/cloudinary.config.js";

export const getJournalsService = async (req, res, next) => {
  const limit = req.query?.limit || 3;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit

  const searchQuery = req.searchQuery;
  const sortBy = req.sortBy;

  try {
    const journals = await Journal.find(searchQuery)
      .populate({ path: "author", select: "username _id imageUrl" })
      .populate("destination")
      .skip(offset)
      .limit(limit)
      .sort(sortBy);

    const count = await Journal.countDocuments(searchQuery);

    const totalPages = Math.ceil(count / limit);

    res.status(200).send(customResponse({
      success: true,
      message: null,
      data: {
        journals,
        totalPages
      }
    }));

  } catch (error) {
    next(error);
  }
}

export const getJournalService = async (req, res, next) => {
  res.status(302).send(customResponse({
    success: true,
    message: "Journal found",
    data: req.journal
  }))
}

export const createJournalService = async (req, res, next) => {

  const {
    title,
    description,
    location,
    date,
    destination,
  } = req.body;

  if (!req.file) {
    return res.status(409).send(customResponse({
      success: false,
      message: "Please provide a image"
    }))
  }

  try {

    const uploadImageStream = await cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          return res.send(customResponse({
            success: false,
            message: "Image upload failed",
            data: null
          }))
        }

        const journal = await Journal.create({
          title,
          description,
          imageUrl: result.secure_url,
          author: req.userId,
          location: JSON.parse(location),
          date,
          destination: destination.toLowerCase()
        })

        await Destination.findByIdAndUpdate(destination, {
          $inc: { count: 1 }
        })

        res.status(201).send(customResponse({
          success: true,
          message: "Journal created successfully",
          data: journal
        }))
      }
    );

    uploadImageStream.end(req.file.buffer);

  } catch
    (error) {
    next(error);
  }
}

export const updateJournalService = async (req, res, next) => {
  const { id: journalId } = req.params;

  if (!isValidObjectId(journalId)) {
    return res.status(404).send(customResponse({
      success: false,
      message: "Journal not found"
    }))
  }

  try {
    const journal = await Journal.findById(journalId);
    const journalOldDestination = journal.destination;

    if (!journal) {
      return res.status(404).send(customResponse({
        success: false,
        message: "Journal not found"
      }))
    }

    if (req.file) {
      const imageUrlToArray = journal.imageUrl.split("/");
      const imageToDeleteId = imageUrlToArray[imageUrlToArray.length - 1].split(".")[0];

      await cloudinary.uploader.destroy(imageToDeleteId);

      const uploadImageStream = await cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error) {
            return res.send(customResponse({
              success: false,
              message: "Image upload failed",
              data: null
            }))
          }

          journal.imageUrl = result.secure_url;

          const updateFields = async () => {
            for (const [field, value] of Object.entries(req.body)) {
              switch (field) {
                case "date" : {
                  journal.date = new Date(value);
                  break;
                }
                case "location": {
                  journal.location = JSON.parse(value);
                  break;
                }
                default : {
                  journal[field] = value;
                  break;
                }
              }
            }
          }

          await updateFields();

          if (journalOldDestination !== req.body.destination) {
            await Promise.all([
              Destination.findByIdAndUpdate(journalOldDestination, { $inc: { count: -1 } }),
              Destination.findByIdAndUpdate(req.body.destination, { $inc: { count: 1 } })
            ])
          }

          await journal.save();
          res.send(customResponse({
            success: true,
            message: "Successfully edited journal",
            data: journal
          }));

        }
      );

      uploadImageStream.end(req.file.buffer);
    } else {
      const updateFields = async () => {
        for (const [field, value] of Object.entries(req.body)) {
          switch (field) {
            case "date" : {
              journal.date = new Date(value);
              break;
            }
            case "location": {
              journal.location = JSON.parse(value)
              break;
            }
            default : {
              journal[field] = value;
              break;
            }
          }
        }
      }

      await updateFields();

      if (journalOldDestination !== req.body.destination) {
        await Promise.all([
          Destination.findByIdAndUpdate(journalOldDestination, { $inc: { count: -1 } }),
          Destination.findByIdAndUpdate(req.body.destination, { $inc: { count: 1 } })
        ])
      }

      await journal.save();
      res.send(customResponse({
        success: true,
        message: "Successfully edited journal",
        data: journal
      }));
    }

  } catch (error) {
    next(error);
  }
}

export const deleteJournalService = async (req, res, next) => {
  const { id: journalId } = req.params;

  if (!isValidObjectId(journalId)) {
    return res.status(404).send(customResponse({
      success: false,
      message: "Journal not found"
    }))
  }

  try {
    const journal = await Journal.findByIdAndDelete(journalId);

    if (journal) {
      await Destination.findByIdAndUpdate(journal.destination, {
        $inc: { count: -1 }
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const getUserJournalsService = async (req, res, next) => {
  try {
    const journals = await Journal.find({ author: req.userId })
      .populate({ path: "author", select: "username _id imageUrl" })
      .populate('destination')
      .exec();

    res.status(302).send(customResponse({
      success: true,
      message: null,
      data: journals
    }))
  } catch (error) {
    next(error);
  }
}

export const registerJournalViewService = async (req, res, next) => {
  const { userId } = req.body;

  if (userId) {
    if (!req.journal.views.userIds.includes(userId)) {
      req.journal.views.userIds.push(userId);
      req.journal.views.count = req.journal.views.userIds.length;
      await req.journal.save();
    }
  }

  res.status(201).send(customResponse({
    success: true,
    message: "Ok",
    data: null,
  }))
};

export const likeJournalService = async (req, res, next) => {
  const journal = req.journal;
  const userId = req.userId;

  const userIndex = journal.likes.userIds.findIndex((likedUserId) => String(likedUserId) === userId);

  if (userIndex !== -1) {
    journal.likes.userIds.splice(userIndex, 1);
    journal.likes.count--;
  } else {
    journal.likes.userIds.push(userId);
    journal.likes.count++;
  }

  await journal.save();

  res.status(201).send(customResponse({
    success: true,
    message: "Ok",
    data: null,
  }))
}
