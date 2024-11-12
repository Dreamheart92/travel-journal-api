import mongoose from "mongoose";

import validationConstants from "../constants/validationConstants.js";

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [validationConstants.JOURNAL_TITLE_MIN_LENGTH, "Title must be at least " + validationConstants.JOURNAL_TITLE_MIN_LENGTH + " characters long"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [validationConstants.JOURNAL_DESCRIPTION_MIN_LENGTH, "Description must be at least " + validationConstants.JOURNAL_DESCRIPTION_MIN_LENGTH + " characters long"],
    trim: true,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: "Comment",
    default: []
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required'],
    validate: {
      validator: function (value) {
        return value.startsWith('http://') || value.startsWith('https://')
      },
      message: 'Image url must start with http:// or https://'
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  location: {
    type: Object,
    required: [true, "Location is required"],
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Date is required"]
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: "Destination",
    required: [true, 'Destination is required']
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  views: {
    userIds: {
      type: [String],
      default: [],
    },
    count: {
      type: Number,
      default: 0,
    }
  },
  likes: {
    userIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    count: {
      type: Number,
      default: 0,
    }
  }
}, {
  timestamps: true
})

journalSchema.index({ title: 1 });
journalSchema.index({ destination: 1 });
journalSchema.index({ createdAt: 1 });

export default mongoose.model("Journal", journalSchema);
