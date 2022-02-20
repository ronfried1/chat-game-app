import React, { useContext, useEffect, useState } from "react";
import SocketContext from "context/socketContext";
import { Badge, ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function UserList(props) {
  const socket = useContext(SocketContext);
  const [count, setCount] = useState(0)

  useEffect(() => {
    if(socket.newMessageForUser == props.userName){
        setCount(count + 1);
        socket.onBadgeChange();
    }

  }, [socket.newMessageForUser])
  

  return (
    <ListItemButton
      key={props.userName}
      sx={{ pl: 4 }}
      onClick={() =>{
           socket.joinRoom(props.userName)
           setCount(0)
        }}
    >
      <Badge color="secondary" badgeContent={count}>
        <ListItemText primary={props.userName} />
      </Badge>
    </ListItemButton>  
  );
}
