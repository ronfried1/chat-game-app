import axios from "axios";

const usersCreateUrl = "http://localhost:5000/users/signup";
const userLoginUrl = "http://localhost:5000/users/login";

export const createUser = (newUser) => axios.post(usersCreateUrl, newUser);
export const loginUser = (user) => axios.post(userLoginUrl, user);
