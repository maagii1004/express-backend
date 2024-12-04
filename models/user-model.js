import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
