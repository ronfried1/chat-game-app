import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "Store";
import { SocketContextProvider } from "context/socketContext";
import App from "./App";

ReactDOM.render(
  <SocketContextProvider>
    <AppContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContextProvider>
  </SocketContextProvider>,
  document.getElementById("root")
);
