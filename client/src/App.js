import React, { useState, useContext, useEffect, useRef } from "react";
import { Between, Grid, Icon, Line } from "UIKit";
import Login from "./Views/Login";
import AppContext from "Store";
import { io } from "socket.io-client";
import "./App.css";
import immer from "immer";
import Chat from "Views/Chat";
import SocketContext from "context/socketContext";

const App = () => {
  const socket = useContext(SocketContext);

  let body;
  if (socket.connected) {
    body = <Chat />;
  } else {
    body = <Login />;
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
