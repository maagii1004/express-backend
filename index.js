import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routers/auth-router.js";
import postRouter from "./routers/post-router.js";
import fileRouter from "./routers/file-router.js";
import userRouter from "./routers/user-router.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3333;
const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use("/api/posts", postRouter);
app.use("/api/files", fileRouter);
app.use("/api/users", userRouter);

app.listen(PORT, async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log(`Server is running on http://localhost:${PORT}`);
});