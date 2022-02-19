import React, { Fragment, useContext, useEffect, useState } from "react";
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
import moment from "moment";
import SendIcon from "@mui/icons-material/Send";
import SocketContext from "context/socketContext";

export default function Chat(props) {
  const socket = useContext(SocketContext);



  const renderMessages = (message, index) => {
    const time = moment(message.createdAt).format("hh:mm");
    const date = moment(message.createdAt).format("MMM Do YY");

    return (
      <ListItem key={index}>
        <ListItemText
          primary={message.userSender}
          secondary={message.messageContent}
        />
        <ListItemText secondary={time + date} />
      </ListItem>
    );
  };

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      socket.sendMessage();
    }
  }
  let body;
  if (socket.currentChat && socket.messages[socket.currentChat]) {
    body = (
      <List>{socket.messages[socket.currentChat].map(renderMessages)}</List>
    );
  } else {
    body = <List></List>;
  }
  
  return (
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
  );
}
