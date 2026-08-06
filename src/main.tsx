import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { KitchenStoreProvider } from "./store/KitchenStore";
import { SecurityProvider } from "./security/SecurityProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KitchenStoreProvider>
      <SecurityProvider>
        <App />
      </SecurityProvider>
    </KitchenStoreProvider>
  </StrictMode>,
);