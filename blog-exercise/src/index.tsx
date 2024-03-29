import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { AuthStoreContextProvider } from "./Components/Auth/AuthStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthStoreContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthStoreContextProvider>
);

reportWebVitals();
