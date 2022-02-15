import React, { useState, useEffect, useRef } from "react";
import immer from "immer";
import { io } from "socket.io-client";

export const SocketContext = React.createContext({
  //...
});

const initialMessagesState = {
  // general: [],
  // random: [],
};

export const SocketContextProvider = (props) => {
  const [username, setusername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    setMessage("");
  }, [messages]);

  function onUsernameChange(e) {
    setusername(e.target.value);
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat,
      sender: username,
    };

    socketRef.current.emit("send message", payload);
    //immer
    const newMessages = immer(messages, (draft) => {
      draft[currentChat].push({
        sender: username,
        content: message,
        // time: Date.now(),
      });
    });
    // const newMessages = [...messages, {sender: username, content: message}];
    setMessages(newMessages);
  }

  function roomJoinCallback(incomingMessages, chatName) {
    const newMessages = immer(messages, (draft) => {
      draft[chatName] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function joinRoom(currentChat) {
    if (!messages[currentChat]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat] = [];
      });
      setMessages(newMessages);

      socketRef.current.emit(
        "join room",
        currentChat,
        (messages, currentChat) => roomJoinCallback(messages)
      );
    }

    setCurrentChat(currentChat);
  }

  function connect() {
    console.log("connecting");
    setConnected(true);
    socketRef.current = io.connect("http://localhost:5000");
    socketRef.current.emit("join server", username);

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
      console.log("new user", allUsers);
    });
    socketRef.current.on(
      "new message",
      ({ content, sender, chatName, time }) => {
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
      }
    );
  }
  return (
    <SocketContext.Provider
      value={{
        // -- state
        connected,
        username,
        message,
        messages,
        yourId: socketRef.current ? socketRef.current.id : "",
        allUsers,
        currentChat,
        // -- funcs
        connect,
        onUsernameChange,
        handleMessageChange,
        sendMessage,
        joinRoom,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
