import User from "../models/user.js";

export const getUserByUserName = async (req, res) => {
  const { userName, userPassword } = req.body;
  User.findOne({ userName }, (err, obj) => {
    if (err) {
      res.status(404).json({ message: "can't log in" });
      return;
    }

    if (obj == null) {
      res.status(404).json({ message: "can't log in" });
      return;
    }

    if (userPassword === obj.userPassword) {
      res.send({
        user: obj,
      });
    } else {
      res.status(404).json({ message: "can't log in" });
    }
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

export function getAllUsers() {
  return new Promise((resolve, reject) => {
    User.find({})
      .then((result) => {
        resolve(
          result.map((user) => ({
            userName: user.userName
          }))
        );
      })
      .catch((err) => reject(err));
  });
}

// export const getAllUsers = async () => {
//   try {
//     const results = await User.find({});
//     const allUsers = results.map((user) => {
//       {
//         user.userName;
//       }
//     });

//     return allUsers;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
