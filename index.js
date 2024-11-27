import express from "express";
import authRouter from "./auth-router.js"
import cors from "cors";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3333;
const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);

app.listen(PORT, async () => {
  await mongoose.connect(connect.env.DATABASE_URL);
  console.log(`Server is running on http://localhost:${PORT}`);
});
