import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: { type: String },
    mediaUrl: { type: String },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", postSchema);

export default PostModel;
