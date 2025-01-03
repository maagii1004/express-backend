import express from "express";
import UserModel from "../models/user-model.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username });
  return res.send(user);
});

export default router;
