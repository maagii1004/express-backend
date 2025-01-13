import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comments", commentSchema);

export default CommentModel;
