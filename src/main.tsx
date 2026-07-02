import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BackendErrorModal } from "./components/ui/backend-error-modal";
import { AuthProvider } from "./contexts/auth-provider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <BackendErrorModal />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
