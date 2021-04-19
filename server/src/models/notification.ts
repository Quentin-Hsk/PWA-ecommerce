import * as mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new mongoose.Schema({
    createdAt:  { type: Date, required: true, default: Date.now },
    to:         { type: ObjectId, required: true, ref: "User" },
    from:       { type: ObjectId, ref: "User" },
    image:      { type: ObjectId, required: true, ref: "Image" },
    type:       String,
    text:       String
});

export default mongoose.model("Notification", notificationSchema);
