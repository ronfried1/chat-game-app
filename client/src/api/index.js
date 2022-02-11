import axios from "axios";

const postUrl = "http://localhost:5000/posts";
const usersCreateUrl = "http://localhost:5000/users/signup";
const userLoginUrl = "http://localhost:5000/users/login";

export const fetchPosts = () => axios.get(postUrl);
export const createUser = (newUser) => axios.post(usersCreateUrl, newUser);
export const loginUser = (user) => axios.post(userLoginUrl, user);
