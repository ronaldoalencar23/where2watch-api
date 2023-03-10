import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema({
  header: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: Types.ObjectId, ref: "User" },
  title: { type: Object, required: true },
  postedAt: { type: Date, default: Date.now() },
  // isMovie: { type: Boolean, default: true },
});

export const CommentModel = model("Comment", commentSchema);
