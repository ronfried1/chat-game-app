import React, { useState, useContext, useEffect, useRef } from "react";
import { Between, Grid, Icon, Line } from "UIKit";
import Login from "./Views/Login";
import Lobby from "./Views/Lobby";
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
    isChannel: false,
    chatName: "general",
    reciverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

useEffect(()=>{
  setMessages("");
},[messages]);

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
    setConnected(true);
    socketRef.current = io.connect("/");
    socketRef.current.emit("join server", username);
    socketRef.current.emit("join room", "general", (messages) =>
      roomJoinCallback(messages, "general")
    );
    socketRef.current.on("new user", (allUsers) => {
      setAllUsers(allUsers);
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
          <div>
            {!connected && <Login username={username} onChange={handleChange} connect={connect} />}
            {/* {connected && <Lobby  />} */}
            {connected && <Chat message={message}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            yourId={socketRef.current? socketRef.current.id : ""}
            allUsers={allUsers}
            joinRoom={joinRoom}
            connectedRooms={connectedRooms}
            currentChat={currentChat}
            toggleChat={toggleChat}
            messages={messages[currentChat.chatName]}
            />}
          </div>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default App;
