import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./globals.css";
import App from "./App";
import Explores from "./explores/page"; 
import Auth from "./auth/page"; 
import WelcomePage from "./welcome-page/page"; 
import RegisterFounder from "./register/founder/page"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explores" element={<Explores />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome-page" element={<WelcomePage />} />
        <Route path="/register/founder" element={<RegisterFounder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
