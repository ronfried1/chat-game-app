import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [socket,setSocket]= useState();
  const [messages, setMessages] = useState([])


  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
  };

  const loginHandler = (username) => {
    localStorage.setItem(username, "1");
    setIsLoggedIn(true);
    setCurrentUser(username) ;
  };
 
  const socketConnection = (username)=>{

    const socket = io.connect("http://localhost:5000",{query:username });

    //reciving messages if somone send them
    socket.on("message", (message) => {
      setMessages([...messages,message])
    });

    socket.on('online users', (onlineUsers)=>{
      console.log(onlineUsers);
    })
  }
  
  const sendMessageSocket = (messageObject) => {
    socket.emit("send message", messageObject);
  };

  const reciveMessageSocket = (callback) => {
    socket.on("message", (message) => {
      callback(message);
    });
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
