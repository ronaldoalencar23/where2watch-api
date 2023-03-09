import { model, Schema } from "mongoose";

const myListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  titles: [{ type: Object, required: true }],
  isMovie: { type: Boolean, default: true },
});

export const MyListModel = model("MyList", myListSchema);
