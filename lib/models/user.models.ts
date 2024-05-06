import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  image: String,
  bio: String,
  onboarded: { type: Boolean, default: false },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  favorites: [Number],
});

const User = mongoose.models.User || mongoose.model("User", userSchema); // this means if the model is already created, use it, else create a new one

export default User;
