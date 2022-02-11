import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";


const initialMessagesState = {
    general: [],
    random: [],
    jokes: [],
    javascript: [],
};

const AppContext = React.createContext({
  isLoggedIn: false,
  currentUser: "",
  onlineUsers: {},
  onLogout: () => {},
  onLogin: (username) => {},
  onSocketConnect: (username)=>{},
  sendMessage: ()=>{}
});

export const AppContextProvider = (props) => {

    const [username, setusername] = useState("");
    const [connected, setConnected] = useState(false);
    const [currentChat, setCurrentChat] = useState({isChannel: true, chatName: "general", reciverId: ""});
    const [connectionrooms, setConnectionrooms] = useState([]);
    const [messages, setMessages] = useState(initialMessagesState);
    const [message, setMessage] = useState("")
    const socket = useRef();


function handleMessageChange(e){
    setMessage(e.target.value);
}
function sendMessage(){
    const payload = {
        content: message,
        to:currentChat.reciverId,
        sender: username,
        chatName: currentChat.chatName,
        isChannel: currentChat.isChannel
    };
    socketRef.current.emit("send message", payload);
    //immer
    const newMessages = [...messages, {sender: username, content: message}];

    setMessages(newMessages); 
}

function roomJoinCallback(incomingMessages, room){
    const newMessages = [...messages,incomingMessages];
    setMessages(newMessages);
};

//immer
function joinRoom(room){
    const newConnectedRooms = [...connectionrooms, room];

    socketRef.current.emit("join room", room, (message)=>
        roomJoinCallback(message, room));

    setConnectionrooms(newConnectedRooms)
};

function toggleChat(currentChat){
    if (!messages[currentChat.chatName]) {
        currentChat.chatName = [];
        const newMessages = [...messages, currentChat.chatName];
        setMessages(newMessages)
    }
    setCurrentChat(currentChat);
}

function handleChange(e){
    setusername(e.target.value);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        onlineUsers: {},
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onSocketConnect: socketConnection,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
