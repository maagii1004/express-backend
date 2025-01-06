import express from "express";
import PostModel from "../models/post-model.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostModel.find({})
    .populate("user", "_id email username fullname")
    .sort({ createdAt: -1 });
  return res.send(posts);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { description, mediaUrl } = req.body;
    const newPost = await PostModel.create({
      description,
      mediaUrl,
      user: user._id,
    });
    return res.send(newPost);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server can't handle that request" });
  }
});

router.get("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const posts = await PostModel.find({ user: _id });
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server can't handle that request" });
  }
});

export default router;
