import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  files: [{ type: String }], // Array of file paths
});
console.log(mongoose.models, "mongoose");
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema); // this means if the model is already created, use it, else create a new one

export default Thread;
