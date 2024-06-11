import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./style.css";
import MouseAnimation from "./components/MouseAnimation.jsx";
// import "./scripts/mouseAnimation.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <MouseAnimation />
    </BrowserRouter>
  </React.StrictMode>
);
