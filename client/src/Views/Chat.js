import React, { Fragment, useContext, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SocketContext from "../context/socketContext";

const rooms = ["general", "random"];

export default function Chat(props) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.connect();

    return () => {};
  }, []);

  function renderUser(user) {
    if (user.socketId === socket.yourId) {
      return (
        <ListItem key={user.socketId}>
          <ListItemText primary={`You: ${user.userName}`} />
        </ListItem>
      );
    }

    return (
      <ListItem
        button
        key={user.userName}
        onClick={() => socket.joinRoom(user.userName)}
      >
        <ListItemText primary={user.userName + " " + user.isOnline} />
      </ListItem>
    );
  }
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      socket.sendMessage();
    }
  }

  const renderMessages = (message, index) => {
    return (
      <ListItem key={index}>
        <ListItemText primary={message.sender} secondary={message.content} />
      </ListItem>
    );
  };
  let body;
  if (socket.currentChat && socket.messages[socket.currentChat]) {
    body = (
      <List>{socket.messages[socket.currentChat].map(renderMessages)}</List>
    );
  } else {
    body = <List></List>;
  }

  return (
    <Fragment>
      <Container className="Lobby" style={{ marginTop: "50px" }}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${240}px)`,
              ml: `${240}px`,
              bgcolor: "transparent",
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Lobby
              </Typography>
            </Toolbar>
          </AppBar>
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
            <div>Users</div>
            <Divider />
            <List>{socket.allUsers.map(renderUser)}</List>
          </Drawer>
          <Paper
            component="main"
            sx={{ flexGrow: 1, p: 3 }}
            id="paper"
            elevation={5}
          >
            <Box id="box" p={3}>
              <Toolbar>{socket.currentChat || "no chat"}</Toolbar>
              <Divider />
              <Grid container spacing={4} alignItems="center">
                <Grid xs={12} item>
                  {body}{" "}
                </Grid>
                <Grid xs={10} item>
                  <FormControl fullWidth>
                    <TextField
                      value={socket.message}
                      name="message"
                      label="Type your Message..."
                      onChange={socket.handleMessageChange}
                      variant="outlined"
                      onKeyPress={handleKeyPress}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={2} item>
                  <IconButton
                    onClick={socket.sendMessage}
                    aria-label="send"
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Fragment>
  );
}
