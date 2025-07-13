import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use the new client API
import App from "./App";

// React Router
import { BrowserRouter } from "react-router-dom";

// Material Kit base CSS
import "assets/css/material-kit-react.css?v=1.10.0";

// ✅ New React 18 root API
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
