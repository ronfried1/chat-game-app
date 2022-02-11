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
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import { getAllUsers } from "./controllers/users.js";

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

let LogedUsers = getAllUsers();
let onlineUsers = [];
const messages = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};
//a user connected...
io.on("connection", (socket) => {
  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    onlineUsers.push(user);
    //need to biuld in client
    io.emit("new user", onlineUsers);
  });

  //need to biuld in client
  socket.on("join room", (roomName, cb) => {
    socket.join(roomName);
    cb(messages[roomName]);
    // socket.emit("joined", messages[roomName]); 
  });

  socket.on("send message", ({ contant, to, sender, chatName, isChannel }) => {
    if(isChannel){
      const payload = {
        contant,
        chatName,
        sender,
      };
      socket.to(to).emit("new message", payload);
    }
   //this is what i need
      const payload = {
        contant,
        chatName: sender,
        sender,
      };
      socket.to(to).emit("new message", payload);
    
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        contant
      });
    }
  });

  socket.on("send message old", body => {
    io.emit("message", body)
})

  socket.on("disconnect", () => {
    onlineUsers.filter((u) =>  u.id !== socket.id);
    io.emit("new user", onlineUsers)
    });

  });

  


app.use("/posts", postRoutes);
app.use("/users", userRoutes);

//CONNECT TO DB
const CONNECTION_URL =
  "mongodb+srv://ron1:ron1@gamecluster.h8l60.mongodb.net/gamecluster?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(console.log("conected to DB"))
  .catch((error) => console.log(`${error} did not connect`));

server.listen(PORT, function () {
  console.log(`listening on port ${PORT} with server socket io`);
});
// app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))
