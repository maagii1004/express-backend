import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credential: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
