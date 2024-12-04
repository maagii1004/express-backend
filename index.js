import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./auth-router.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3333;
const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);

app.listen(PORT, async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log(`Server is running on http://localhost:${PORT}`);
});
