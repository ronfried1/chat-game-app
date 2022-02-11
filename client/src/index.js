import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "Store";
import App from "./App";

ReactDOM.render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContextProvider>,
  document.getElementById("root")
);
