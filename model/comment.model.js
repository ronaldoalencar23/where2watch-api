import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema({
  header: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: Types.ObjectId, ref: "User" },
  title: { type: String },
  postedAt: { type: Date, default: Date.now() },
});

export const CommentModel = model("Comment", commentSchema);
