import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// React Router
import { BrowserRouter } from "react-router-dom";

// Material Kit base CSS
import "assets/css/material-kit-react.css?v=1.10.0";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
