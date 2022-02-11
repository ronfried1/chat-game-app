import  mongoose  from "mongoose";

const chatSchema = mongoose.Schema({
    chatUsers: [int],
    messages: [String]
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
  