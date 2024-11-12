import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        defaultValue: []
    },
    dislikes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        defaultValue: []
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        required: true
    }
}, {timestamps: true});

commentSchema.pre("save", async function () {
    this.totalLikes = this.likes.length - this.dislikes.length;
})

export default mongoose.model("Comment", commentSchema);