import mongoose from "mongoose";

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
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

postSchema.virtual("comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "post",
});

postSchema.virtual("likes", {
  ref: "likes",
  localField: "_id",
  foreignField: "post",
});

const PostModel = mongoose.model("posts", postSchema);

export default PostModel;
