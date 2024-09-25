import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { global } from "global";
import "./style.css";
import MouseAnimation from "./components/MouseAnimation.jsx";

// Polyfill global object for browser environment
if (typeof global === "undefined") {
  window.global = window;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <MouseAnimation />
    </BrowserRouter>
  </React.StrictMode>
);
