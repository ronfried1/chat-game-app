import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
  messageContent: { type: String, required: true },
  userSender: String,
  userReciver: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const UserMessage = mongoose.model("Message", MessageSchema);

export default UserMessage;
