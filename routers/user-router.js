import express from "express";
import UserModel from "../models/user-model.js";
import FollowModel from "../models/follow-model.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { nanoid } from "nanoid";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: "dbe8hpeo9",
  api_key: "882294857276626",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${nanoid()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.use(upload.single("file"));

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username })
    .populate("posts")
    .populate("followers")
    .populate("followings");
  return res.send(user);
});

router.post("/:username/image", authMiddleware, async (req, res) => {
  const username = req.params.username;
  const currentUsername = req.user.username;

  if (username !== currentUsername)
    return res
      .status(403)
      .send({ message: "You cant't change other user profile" });

  try {
    const response = await cloudinary.uploader.upload(req.file.path);
    const profileUrl = response.secure_url;
    await UserModel.updateOne({ username }, { profileUrl });
    return res.send({ message: "Updated success!", profileUrl });
  } catch (err) {
    return res.status(500).send({
      message: "Failed to upload!",
    });
  }
});

router.post("/follow", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const myId = req.user._id;
  const existingUser = await UserModel.findOne({ _id: userId });
  if (!existingUser)
    return res.status(404).send({ message: "User not found!" });

  const existingFollow = await FollowModel.findOne({
    user: userId,
    follower: myId,
  });

  if (existingFollow) {
    // Herev follow hiisen baival:
    await FollowModel.findByIdAndDelete(existingFollow._id);
    return res.send({ followed: false, message: "Анфоллов хийлээ" });
  } else {
    // Herev follow hiigeegui baival:
    await FollowModel.create({
      user: userId,
      follower: myId,
    });
    return res.send({ followed: true, message: "Фоллов хийлээ" });
  }
});

export default router;
