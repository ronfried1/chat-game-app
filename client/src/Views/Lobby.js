import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useInput } from "Hooks/useInput";
import { fetchPosts, createUser, loginUser } from "api";
import "./Login.css";
import React, {
  Fragment,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";
import AppContext from "Store";
import { io } from "socket.io-client";
import {
  sendMessageSocket,
  reciveMessageSocket,
  connectSocket,
  getIdSocket,
} from "Socket/socketRef";

import "./Lobby.css";

const Lobby = () => {
  const ctx = useContext(AppContext);
  const [yourID, setYourID] = useState();
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000",{query:ctx.currentUser });
    // connectSocket();
    socketRef.current.emit("join server", (ctx.currentUser));

    socketRef.current.on("your id", (id) => {
      setYourID(id);
    });
    // getIdSocket(setYourID);
    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    });

    // console.log("after id getter");
    // console.log({yourID});
    // reciveMessageSocket(receivedMessage);
  }, []);

  // function recivedId(id){
  //   setYourID(id);
  //   console.log(yourID);
  // }

  function receivedMessage(message) {
    setChat((oldMsgs) => [...oldMsgs, message]);
  }

  const onMessageSubmit = (e) => {
    e.preventDefault();
    console.log();
    const messageObject = {
      body: message,
      id: yourID,
      reciverId: "",
    };
    // console.log(yourID);
    setMessage("");
    // sendMessageSocket(messageObject);
    socketRef.current.emit("send message old", messageObject);
  };

  const onTextChange = (e) => {
    setMessage(e.target.value);
  };

  const onLogoutHandler = () => {
    // socket.emit("disconnect", socket.id);
    ctx.onLogout();
  };

  const renderChat = () => {
    return chat.map((message, index) => {
      if (message.id === yourID) {
        return (
          <ListItem key={index}>
            <ListItemText primary={message.body} />
          </ListItem>
        );
      }
      return (
        <ListItem key={index}>
          <ListItemText primary={message.body} />
        </ListItem>
      );
    });
  };
  return (
    <Fragment>
      <Container className="Lobby" style={{ marginTop: "100px" }}>
        <Paper elevation={5}>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Chat log
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems="center">
              <Grid id="chat-window" xs={12} item>
                <List id="chat-window-messages">{renderChat()}</List>
              </Grid>
              <Grid xs={9} item>
                <FormControl fullWidth>
                  <TextField
                    name="message"
                    label="Type your Message..."
                    onChange={(e) => onTextChange(e)}
                    value={message}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid xs={1} item>
                <IconButton
                  onClick={onMessageSubmit}
                  aria-label="send"
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          <Button onClick={onLogoutHandler}>Log out</Button>
        </Paper>
      </Container>
    </Fragment>
  );
};
export default Lobby;
