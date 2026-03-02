import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Stamp the build timestamp into the inline SW cache-buster script so it can
// detect stale caches. __APP_BUILD__ is replaced at build time by Vite define.
const BUILD_KEY = 'gcg_sw_build';
const currentBuild = typeof __APP_BUILD__ !== 'undefined' ? __APP_BUILD__ : null;
if (currentBuild) {
  const stored = localStorage.getItem(BUILD_KEY);
  if (stored !== currentBuild) {
    localStorage.setItem(BUILD_KEY, currentBuild);
    if (stored !== null && 'serviceWorker' in navigator) {
      // New build – clear stale SW + caches and reload once
      navigator.serviceWorker.getRegistrations()
        .then(regs => Promise.all(regs.map(r => r.unregister())))
        .then(() => caches.keys())
        .then(keys => Promise.all(keys.map(k => caches.delete(k))))
        .then(() => window.location.reload());
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
