import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: { type: String },
    mediaUrl: { type: String },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", postSchema);

export default PostModel;
