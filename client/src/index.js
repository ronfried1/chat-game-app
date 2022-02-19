import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

import { SocketContextProvider } from "context/socketContext";
import App from "./App";

ReactDOM.render(
  <SocketContextProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>

  </SocketContextProvider>,
  document.getElementById("root")
);
