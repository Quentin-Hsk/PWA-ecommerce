import * as mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    author:     { type: ObjectId, required: true, ref: "User" },
    createdAt:  { type: Date, required: true, default: Date.now },
    text:       String,
});

export default mongoose.model("Comment", commentSchema);
