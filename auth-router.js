import express from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { object, string, number, date } from "yup";
import UserModel from "./models/user-model.js";

const router = express.Router();

const signUpSchema = object({
  email: string().email("Invalid email structure"),
  username: string().min(3, "Username must be at least 3 letters long"),
  password: string()
    .min(8, "Password must be at least 8 letters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one CAPITAL letter"),
});


router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  await signUpSchema.validate({ email, username, password });

  if (!email || !username || !password) {
    return res.status(400).send({ message: "Incomplete input!" });
  }

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).send({ message: "Email already exists" });
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) return res.status(400).send({ message: "Hashing error" });
    const newUser = { id: nanoid(), email, username, password: hash };
    await UserModel.create(newUser);
    res.status(201).send({ message: "User registered successfully!" });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Please don't leave empty input!" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "Email not found!" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(400).send({ message: "Comparison error" });
    if (!result) {
      return res.status(400).send({ message: "Invalid password!" });
    }
    res.status(200).send({ message: "Login successful!" });
  });
});

export default router;
