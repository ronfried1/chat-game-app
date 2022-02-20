import React, { useState, useEffect, useRef } from "react";
import immer from "immer";
import { io } from "socket.io-client";

export const SocketContext = React.createContext({
  //...
});

export const SocketContextProvider = (props) => {
  const [username, setusername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const socketRef = useRef();
  const [newMessageForUser, setnewMessageForUser] = useState("")

  useEffect(() => {
    setMessage("");
  }, [messages]);

  useEffect(() => {
    const online = allUsers.filter((user) => user.isOnline === true);
    setOnlineUsers(online);
    const offline = allUsers.filter((user) => user.isOnline === false);
    setOfflineUsers(offline);
  }, [allUsers]);

  useEffect(() => {
    const storedUserLoggedInInfo = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInfo) {
      setusername(storedUserLoggedInInfo)
      setConnected(true);
    }
  }, []);




  // function onUsernameChange(e) {
  //   setusername(e.target.value);
  // }

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage() {

if(message.length != 0){

  const payload = {
    messageContent: message,
    userReciver: currentChat,
    userSender: username,
    createdAt: new Date(),
  };
  
  socketRef.current.emit("send message", payload);
  payload.createdAt = payload.createdAt.toISOString();
  
  const newMessages = immer(messages, (draft) => {
    draft[currentChat].push(payload);
  });
  setMessages(newMessages);
}
  }

  function roomJoinCallback(incomingMessages, currentChat) {
    const newMessages = immer(messages, (draft) => {
      draft[currentChat] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function joinRoom(currentChat) {
    if (!messages[currentChat]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat] = [];
      });
      setMessages(newMessages);

      socketRef.current.emit("join room", currentChat, (messages) =>
        roomJoinCallback(messages, currentChat)
      );
    }

    setCurrentChat(currentChat);
  }

  function connect(usernamefrom) {
    if(usernamefrom){
      setusername(usernamefrom)
    }
    console.log("connecting");
    setConnected(true);
    socketRef.current = io.connect("http://localhost:5000");
    socketRef.current.emit("join server", username);
    localStorage.setItem("isLoggedIn",username);

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
    });
    socketRef.current.on(
      "new message",
      ({ messageContent, userSender, userReciver, createdAt }) => {
        if(username == userReciver){
          setnewMessageForUser(userSender)
        }
        setMessages((messages) => {
          const newMessages = immer(messages, (draft) => {
            if (draft[userSender]) {
              draft[userSender].push({ messageContent, userSender, createdAt });
            } else {
              draft[userSender] = [{ messageContent, userSender, createdAt }];
            }
          });
          return newMessages;
        });
      }
    );
  }
  function logOut(){
    setusername("");
    localStorage.removeItem("isLoggedIn")
    setConnected(false);
    window.location.reload(false)
    socketRef.current.emit("disconnect")
  }
  function onBadgeChange(){
  setnewMessageForUser("")
  }

  return (
    <SocketContext.Provider
      value={{
        // -- state
        connected,
        username,
        message,
        newMessageForUser,
        messages,
        yourId: socketRef.current ? socketRef.current.id : "",
        allUsers,
        currentChat,
        onlineUsers,
        offlineUsers,
        // -- funcs
        connect,
        logOut,
        handleMessageChange,
        sendMessage,
        joinRoom,
        onBadgeChange,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
