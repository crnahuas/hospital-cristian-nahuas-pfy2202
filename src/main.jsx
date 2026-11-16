import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./services/queryClient.js";
import App from "./App.jsx";
import "./styles/global.css";

async function start() {
  // Activa el servicio local antes de renderizar las consultas iniciales.
  if (import.meta.env.VITE_ENABLE_MOCKS !== "false") {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  }
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={createQueryClient()}>
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

start().catch(() => {
  const root = document.getElementById("root");
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent =
    "No pudimos iniciar el servicio. Inicia el servidor local y vuelve a cargar la página.";
  const retry = document.createElement("button");
  retry.textContent = "Volver a cargar";
  retry.addEventListener("click", () => window.location.reload());
  root.replaceChildren(message, retry);
});
