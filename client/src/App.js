import React, { useContext } from "react";
// import { Between, Grid, Icon, Line } from "UIKit";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
} from "@mui/material";
import Login from "./Views/Login";
import "./App.css";
import Lobby from "Views/Lobby";
import SocketContext from "context/socketContext";

import AppNavBar from "components/Header";
import { Route, Routes } from "react-router-dom";
import HowToPlay from "components/HowToPlay";
import About from "components/About";

const App = () => {
  const socket = useContext(SocketContext);


  let body;
  if (socket.connected) {
    body = <Lobby />;
  } else {
    body = <Login />;
  }

  return (
    <React.Fragment>
      <div className="App">
        <Grid>
        <AppNavBar  />
          <Routes>
            <Route path="/Home" element={socket.connected? <Lobby/>:<Login/>} />
            <Route path="/How to play" element={<HowToPlay/>} />
            <Route path="/About" element={<About/>} />
          </Routes>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default App;
