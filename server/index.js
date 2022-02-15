import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
// const http = require('http');
import http from "http";
const app = express();
const server = http.createServer(app);
// const { Server } = require("socket.io");
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// require ('dotenv/config');

// IMPORT ROUTES

import userRoutes from "./routes/users.js";
import { getAllUsers } from "./controllers/users.js";
import { getMessagesBetween, createMessage } from "./controllers/messages.js";

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

let LogedUsers = [];

const messages = {
  general: [],
  random: [],
};
//a user connected...
io.on("connection", (socket) => {
  let currentUsername = null;
  console.log("connection");

  socket.on("join server", (username) => {
    currentUsername = username;
    console.log("join server : ", username);
    LogedUsers.forEach((user) => {
      if (user.userName === username) {
        user.isOnline = true;
        user.socketId = socket.id;
      }
    });
    console.log({ LogedUsers });
    io.emit("new user", LogedUsers);
  });

  socket.on("join room", async (roomName, cb) => {
    const messagesBetween = await getMessagesBetween(currentUsername, roomName);
    cb(messagesBetween, roomName);
  });

  socket.on("send message", async ({ messageContent, userReciver, userSender, createdAt }) => {
    const payload = await createMessage(messageContent, userReciver, userSender,createdAt );
    console.log({ payload });
    const to = LogedUsers.find(u => u.userName === userReciver)
    console.log(to.socketId, to);
    socket.to(to.socketId).emit("new message", payload);

    // if (messages[chatName]) {
    //   messages[chatName].push({
    //     sender,
    //     content,
    //   });
    // }
  });

  socket.on("disconnect", () => {
    //onlineUsers = onlineUsers.filter((u) => u.id !== socket.id);
    LogedUsers.forEach((user) => {
      if (user.socketId === socket.id) {
        user.isOnline = false;
        user.socketId = "";
      }
    });
    io.emit("new user", LogedUsers);
  });
});

app.use("/users", userRoutes);

//CONNECT TO DB
const CONNECTION_URL =
  "mongodb+srv://ron1:ron1@gamecluster.h8l60.mongodb.net/gamecluster?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log("conected to DB"))
  .then(() => {
    server.listen(PORT, function () {
      console.log(`listening on port ${PORT} with server socket io`);
    });
  })
  .then(() => getAllUsers())
  .then((users) => {
    console.log({ users });
    users.forEach((user) => {
      user.isOnline = false;
      user.socketId = "";
    });
    console.log({ users });
    LogedUsers = users;
  })
  .catch((error) => console.log(`${error} did not connect`));

// app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))
