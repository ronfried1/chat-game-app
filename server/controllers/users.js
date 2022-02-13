import User from "../models/user.js";

export const getUserByUserName = async (req, res) => {
  const { userName, userPassword } = req.body;
  //add try catch
  User.findOne({ userName, userPassword }, (err, obj) => {
    res.send({
      user: obj,
    });
  });
};

export const createUser = async (req, res) => {
  const { userName, userPassword } = req.body;
  const newUser = new User({ userName, userPassword });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAllUsers = async () => {
  try {
    const results = await User.find({});
    const allUsers = results.map((user) => user.userName);
    return allUsers;
  } catch (error) {
    console.log(error);
    return null;
  }
};
