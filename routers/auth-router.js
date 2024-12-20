import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";

const router = express.Router();

const checkIsPhoneNumber = (credential) => {
  if (credential.length !== 8) return false;
  if (isNaN(Number(credential))) return false;
  const firstCharacter = credential[0];
  if (!["9", "8", "7", "6"].includes(firstCharacter)) return false;
  return true;
};

const checkIsEmail = (credential) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(credential);
};

router.post("/signup", async (req, res) => {
  const { credential, password, fullname, username } = req.body;
  if (!credential || credential === "") {
    return res.status(400).send({ message: "Email or Phone required!" });
  }
  if (!password || password === "") {
    return res.status(400).send({ message: "Password required!" });
  }
  if (!fullname || fullname === "") {
    return res.status(400).send({ message: "Fullname required!" });
  }
  if (!username || username === "") {
    return res.status(400).send({ message: "Fullname required!" });
  }
  // BUH TALBAR UTGATAI BAIGAA

  if (password.length < 7) {
    return res.status(400).send({
      message: "Ta 8 buyu tuunees deesh temdegttei password hiine uu!",
    });
  }

  const existingUser = await UserModel.findOne({ username: username });
  if (existingUser) {
    return res.status(400).send({ message: "Username burtgeltei baina!" });
  }

  const isPhoneNumber = checkIsPhoneNumber(credential);
  const isEmail = checkIsEmail(credential);

  if (!isPhoneNumber && !isEmail) {
    return res
      .status(400)
      .send({ message: "Ta zovhon utasnii dugaar esvel email oruulna uu!" });
  }

  if (isPhoneNumber) {
    const existingUser = await UserModel.findOne({ phone: credential });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Utasnii dugaar burtgeltei baina!" });
    } else {
      bcrypt.hash(password, 10, async function (err, hash) {
        const newUser = {
          phone: credential,
          fullname: fullname,
          password: hash,
          username: username,
        };
        await UserModel.create(newUser);
        return res.status(201).send(newUser);
      });
    }
  }

  if (isEmail) {
    const existingUser = await UserModel.findOne({ email: credential });
    if (existingUser) {
      return res.status(400).send({ message: "Email burtgeltei baina!" });
    } else {
      bcrypt.hash(password, 10, async function (err, hash) {
        const newUser = {
          email: credential,
          fullname: fullname,
          password: hash,
          username: username,
        };
        await UserModel.create(newUser);
        return res.status(201).send(newUser);
      });
    }
  }
});

router.post("/signin", async (req, res) => {
  const { credential, password } = req.body;

  let existingUser = null;
  if (checkIsPhoneNumber(credential)) {
    existingUser = await UserModel.findOne({ phone: credential });
  } else if (checkIsEmail(credential)) {
    existingUser = await UserModel.findOne({ email: credential });
  } else {
    existingUser = await UserModel.findOne({ username: credential });
  }

  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "Credential or password not correct!" });
  }

  bcrypt.compare(password, existingUser.password, function (err, result) {
    if (!result) {
      return res
        .status(400)
        .send({ message: "Email or password not correct!" });
    } else {
      return res.status(200).send({ message: "Welcome" });
    }
  });
});

export default router;
