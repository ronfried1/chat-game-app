import express from "express";
import { getChat, createNewChat } from "../controllers/chat.js";

const router = express.Router();

router.get("/", getChat);
router.post("/", createNewChat);

export default router;