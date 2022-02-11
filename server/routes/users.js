import express from "express";
import {createUser, getUserByUserName } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", getUserByUserName);

export default router;