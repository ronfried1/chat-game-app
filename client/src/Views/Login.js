import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Button,
  Grid,
  Input,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { createUser, loginUser } from "api";
import { useNavigate } from "react-router-dom";
import AppContext from "Store";

import { getIdSocket } from "Socket/socketRef";

const userNameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 0 };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length >= 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [signin, setSignin] = useState(true);

  const [formIsValid, setFormIsValid] = useState(false);

  const [userNameState, dispatchUserName] = useReducer(userNameReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const ctx = useContext(AppContext);

  const userNameInputRef = useRef();
  const passwordInputRef = useRef();

  const { isValid: userNameIsValid } = userNameState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(userNameIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [userNameIsValid, passwordIsValid]);

  const userNameChangeHandler = (event) => {
    dispatchUserName({ type: "USER_INPUT", val: event.target.value });
    props.onChange(event);
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      if (signin) {
        loginUser({
          userName: userNameState.value,
          userPassword: passwordState.value,
        }).then((user) => {
          if (user) {
            // ctx.onLogin((user.data.user.userName));
            //get socket conect
            props.connect();
          }
        });
      } else {
        createUser({
          userName: userNameState.value,
          userPassword: passwordState.value,
        }).then((user) => {
          if (user) {
            // ctx.onLogin();
            props.connect();
          }
        });
      }
    }
  };

  const paperStyle = {
    padding: 20,
    paddinTop: 0,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };

  const [value, setValue] = useState(1);
  const onTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container className="Login" style={{ marginTop: "100px" }}>
      <Paper style={paperStyle} elevation={10}>
        <Grid
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={onTabChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Log In" onClick={() => setSignin(true)} />
            <Tab label="Sign Up" onClick={() => setSignin(false)} />
          </Tabs>
        </Grid>
        <Grid marginTop="40px">
          <form onSubmit={submitHandler}>
            <TextField
              variant="standard"
              ref={userNameInputRef}
              label="Username"
              placeholder="Enter username"
              value={userNameState.value}
              onChange={userNameChangeHandler}
              fullWidth
              required
            />
            <TextField
              variant="standard"
              ref={passwordInputRef}
              label="Password"
              placeholder="Enter password"
              type="password"
              value={passwordState.value}
              onChange={passwordChangeHandler}
              fullWidth
              required
            />
            {signin && (
              <Button
                type="submit"
                color="primary"
                variant=" contained"
                fullWidth
              >
                Log in
              </Button>
            )}
            {signin && (
              <Button
                onClick={() => setSignin(false)}
                color="primary"
                variant=" contained"
                fullWidth
              >
                Create New account
              </Button>
            )}
            {!signin && (
              <Button
                type="submit"
                color="primary"
                variant=" contained"
                fullWidth
              >
                Sign up
              </Button>
            )}
          </form>
        </Grid>
      </Paper>
    </Grid>
  );
};
export default Login;
