import * as mongoose from "mongoose";
require("./comment");

const ObjectId = mongoose.Schema.Types.ObjectId;

// TODO: Add URL validator on source
const imageSchema = new mongoose.Schema({
    author: { type: ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, required: true, default: Date.now },
    source: { type: String, required: true },
    description: String,
    miniature: String,
    keywords: [String],
    mentions: [{ type: ObjectId, ref: "User" }],
    comments: [{ type: ObjectId, ref: "Comment" }],
    likes: [{ type: ObjectId, ref: "User" }]
});

export default mongoose.model("Image", imageSchema);
