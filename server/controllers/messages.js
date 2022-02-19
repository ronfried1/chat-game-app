import Message from "../models/message.js";

export const getMessagesBetween = async (user1, user2) => {
  return new Promise((resolve, reject) => {
    Message.find({
      $or: [
        { userSender: user1, userReciver: user2 },
        { userSender: user2, userReciver: user1 },
      ],
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });


  //add try catch
  // User.findOne({ userName, userPassword }, (err, obj) => {
  let results;

  Message.find({
    $or: [
      { userSender: user1, userReciver: user2 },
      { userSender: user2, userReciver: user1 },
    ],
  }).then((results) => {
    console.log(results);
  });
};

export const createMessage = async (content, to, sender, time) => {
  const message = new Message({
    messageContent: content,
    userSender: sender,
    userReciver: to,
    createdAt: time
  });
  try {
    return await message.save();
  } catch (error) {
    console.log("didn't save");
  }
};
//   Message.find({ userSender: user1, userReciver: user2 }).then((res1) => {
//     results.push(res1);
//     Message.find({ userSender: user2, userReciver: user1 }).then((res2) => {
//       results.push(res2);
//     });
//   });
//   const MessageSchema = mongoose.Schema({
//     messageContent: { String, required: true },
//     userSender: string,
//     userReciver: string,
//     createdAt: {
//       type: Date,
//       default: new Date(),
//     },
//   });