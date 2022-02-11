import React, { Fragment } from "react";
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

const rooms = [];


export default function Chat(props) {
    
  function renderRooms(room) {
    const currentChat = {
      chatName: room,
      isChannel: true,
      receiverId: "",
    };
    return (
      <ListItem button key={room} onClick={() => props.toggleChat(currentChat)}>
        <ListItemText primary={room} />
      </ListItem>
    );
  }
  function renderUser(user) {
    if (user.id === props.yourId) {
      return (
        <ListItem key={user.id}>
          <ListItemText primary={`You: ${user.username}`} />
        </ListItem>
      );
    }
    const currentChat = {
      chatName: user.username,
      isChannel: false,
      receiverId: user.id,
    };
    return (
      <ListItem
        button
        key={user.id}
        onClick={() => props.toggleChat(currentChat)}
      >
        <ListItemText primary={user.username} />
      </ListItem>
    );
  }
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      props.sendMessage();
    }
  }

  let body;
  if (
    !props.currentChat.isChannel ||
    props.connectedRooms.includes(props.currentChat.chatName)
  ) {
    body = (<List>{props.messages.map(renderMessages)}</List>);
  } else {
    body = (
      <Button
        onClick={() => {
          props.joinRoom(props.currentChat.chatName);
        }}
      >
        Join {props.currentChat.chatName}
      </Button>
    );
  }

  const renderMessages = (message, index) => {
    return (
      <div key={index}>
        <h3>{message.sender}</h3>
        <p>{message.content}</p>
      </div>
    );

    // return chat.map((message, index) => {
    //   if (message.id === yourID) {
    //     return (
    //       <ListItem key={index}>
    //         <ListItemText primary={message.body} />
    //       </ListItem>
    //     );
    //   }
    //   return (
    //     <ListItem key={index}>
    //       <ListItemText primary={message.body} />
    //     </ListItem>
    //   );
    // });
  };

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
            <div>Channels</div>
            <Divider />
            <List>{rooms.map(renderRooms)}</List>
            <List>
              <div>Users</div>
              <Divider />
              {props.allUsers.map(renderUser)}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
          >
            <Toolbar />
            <Typography paragraph>{props.currentChat.chatname}</Typography>
            <Typography paragraph>{body}</Typography>
          </Box>
          <Grid xs={9} item>
            <FormControl fullWidth>
              <TextField
                name="message"
                label="Type your Message..."
                onChange={props.handleMessageChange}
                value={props.message}
                variant="outlined"
                onKeyPress={handleKeyPress}
              />
            </FormControl>
          </Grid>
          <Grid xs={1} item>
            <IconButton
              onClick={props.sendMessage}
              aria-label="send"
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
}
