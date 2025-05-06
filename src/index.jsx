import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
