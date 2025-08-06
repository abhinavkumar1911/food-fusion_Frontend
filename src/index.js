import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';



//  Add the clearStorageOnLoad function here
if (process.env.NODE_ENV === "development") {
  (function clearAllStorage() {
    try {
      localStorage.clear();
      sessionStorage.clear();

      document.cookie.split(";").forEach(c => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      if ("caches" in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }

      console.log("✅ Auto-cleared storage, cookies, and cache");
    } catch (e) {
      console.warn("⚠️ Failed to clear site data:", e);
    }
  })();
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
  
);
