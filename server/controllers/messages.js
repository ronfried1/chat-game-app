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
