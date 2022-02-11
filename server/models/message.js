import  mongoose  from "mongoose";

const MessageSchema = mongoose.Schema({
    messageContant:{ String,
    required: true
    },
    userSender: string,
    userReciver: string,
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const UserMessage = mongoose.model('Message', MessageSchema);

export default UserMessage;
  