import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  AppBar,
  Badge,
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SocketContext from "../context/socketContext";
import {
  CircleOutlined,
  ExpandLess,
  ExpandMore,
  InboxOutlined,
  StarBorder,
} from "@mui/icons-material";
import Chat from "components/Chat";
import UserList from "components/UserList";

export default function Lobby(props) {
  const socket = useContext(SocketContext);
  const [onlineOpen, setOnlineOpen] = useState(true);
  const [offlineOpen, setOfflineOpen] = useState(true);

  useEffect(() => {
    socket.connect();

    return () => {};
  }, []);

  function renderUser(user) {
    if (user.socketId === socket.yourId) {
      return;
    }
    return (
   <UserList userName ={user.userName}/>
    );
    
  }
  const handleOnlineClick = () => {
    setOnlineOpen(!onlineOpen);
  };
  const handleOfflineClick = () => {
    setOfflineOpen(!offlineOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "50%" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
        >
          <ListItemButton onClick={handleOnlineClick}>
            <ListItemIcon>
              <CircleOutlined style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary="Online Users" />
            {onlineOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={onlineOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {socket.onlineUsers.map(renderUser)}
            </List>
          </Collapse>
        </List>
        <Divider />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
        >
          <ListItemButton onClick={handleOfflineClick}>
            <ListItemIcon>
              <CircleOutlined style={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Offline Users" />
            {offlineOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={offlineOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {socket.offlineUsers.map(renderUser)}
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Paper
        component="main"
        sx={{ flexGrow: 1, p: 3, margin: 20 }}
        id="paper"
        elevation={5}
      >
        <Toolbar />
        <Chat />
      </Paper>
    </Box>
  );
}
