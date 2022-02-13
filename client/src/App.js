import React, { useState, useContext, useEffect, useRef } from "react";
import { Between, Grid, Icon, Line } from "UIKit";
import Login from "./Views/Login";
import AppContext from "Store";
import { io } from "socket.io-client";
import "./App.css";
import immer from "immer";
import Chat from "Views/Chat";

const initialMessagesState = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};
const App = () => {
  // const ctx = useContext(AppContext);

  const [username, setusername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    reciverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    setMessage("");
  }, [messages]);

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.reciverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send message", payload);
    //immer
    const newMessages = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    // const newMessages = [...messages, {sender: username, content: message}];
    setMessages(newMessages);
  }

  function roomJoinCallback(incomingMessages, room) {
    //immer
    const newMessages = immer(messages, (draft) => {
      draft[room] = incomingMessages;
    });
    // const newMessages = [...messages,incomingMessages];
    setMessages(newMessages);
  }

  function joinRoom(room) {
    //immer
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    // const newConnectedRooms = [...connectionrooms, room];

    socketRef.current.emit("join room", room, (message) =>
      roomJoinCallback(message, room)
    );

    setConnectedRooms(newConnectedRooms);
  }

  //get the right chat messages.
  //if there's no chat, it creats ne array in the messageschat list
  function toggleChat(currentChat) {
    if (!messages[currentChat.chatName]) {
      //immer
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      // currentChat.chatName = [];
      // const newMessages = [...messages, currentChat.chatName];
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  function handleChange(e) {
    setusername(e.target.value);
  }

  function connect() {
    console.log("connecting");
    setConnected(true);
    socketRef.current = io.connect("http://localhost:5000");
    socketRef.current.emit("join server", username);
    socketRef.current.emit("join room", "general", (messages) =>
      roomJoinCallback(messages, "general")
    );

    //NO DATA RENDER
    socketRef.current.on("connect", () => {
      console.log("socket connected");
    });
    socketRef.current.on("disconnect", () => {
      console.log("socket disconnect");
    });
    socketRef.current.on("connect_error", (connect_error) => {
      console.log("socket connect_error", connect_error);
    });

    socketRef.current.on("new user", (allUsers) => {
      setAllUsers(allUsers);
      console.log(allUsers);
    });
    socketRef.current.on("new message", ({ content, sender, chatName }) => {
      setMessages((messages) => {
        //immer
        const newMessages = immer(messages, (draft) => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      });
    });
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <Login username={username} onChange={handleChange} connect={connect} />
    );
  }
  return (
    <React.Fragment>
      <div className="App">
        <Grid>
          <div>
            <Between>
              <Line>
                <Icon i="dice" />
                <div>
                  <span>Game & Chat</span>
                </div>
              </Line>
            </Between>
          </div>
          <div>{body}</div>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default App;
