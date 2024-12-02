import express from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { object, string } from "yup";
import UserModel from "./models/user-model.js";

const router = express.Router();

const signUpSchema = object({
  username: string()
    .min(3, "Username must be at least 3 letters long")
    .required(),
  password: string()
    .min(8, "Password must be at least 8 letters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one CAPITAL letter")
    .required(),
});

const checkIsPhoneNumber = (credential) => {
  if (credential.length !== 8) return false;
  if (isNaN(Number(credential))) return false;
  const firstCharacter = credential[0];
  return ["9", "8", "7", "6"].includes(firstCharacter);
};

const checkIsEmail = (credential) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(credential);
};

router.post("/signup", async (req, res) => {
  const { fullname, username, credential, password } = req.body;

  try {
    await signUpSchema.validate({ username, password });

    if (!credential) {
      return res.status(400).send({ message: "Email or Phone is required!" });
    }

    if (!fullname) {
      return res.status(400).send({ message: "Fullname is required!" });
    }

    const isEmail = checkIsEmail(credential);
    const isPhone = checkIsPhoneNumber(credential);

    if (!isEmail && !isPhone) {
      return res
        .status(400)
        .send({ message: "Invalid Email or Phone format!" });
    }

    const query = isEmail ? { email: credential } : { phone: credential };
    const credentialExists = await UserModel.findOne(query);

    if (credentialExists) {
      return res.status(400).send({
        message: `${isEmail ? "Email" : "Phone number"} is already registered!`,
      });
    }

    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return res.status(400).send({ message: "Username is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: nanoid(),
      fullname,
      username,
      password: hashedPassword,
      credential,
    };

    await UserModel.create(newUser);
    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res
      .status(400)
      .send({ message: "Email/Phone and Password are required!" });
  }

  try {
    const query = checkIsEmail(credential)
      ? { email: credential }
      : checkIsPhoneNumber(credential)
      ? { phone: credential }
      : null;

    if (!query) {
      return res
        .status(400)
        .send({ message: "Invalid Email or Phone format!" });
    }

    const user = await UserModel.findOne(query);
    if (!user) {
      return res
        .status(400)
        .send({ message: "No account found with that credential!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid password!" });
    }

    res.status(200).send({ message: "Login successful!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
