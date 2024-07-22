import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

window.onload = function () {
  const queryClient = new QueryClient();

  const galleries = (window as any)?.rid_params?.galleries ?? [];

  for (const gallery of galleries) {
    const { elementid, images, rowheight } = gallery;

    const galleryElement = document.getElementById(elementid);
    if (!galleryElement) {
      console.error(`Gallery with ID ${elementid} not found`);
      continue;
    }

    ReactDOM.createRoot(galleryElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App images={images} elementId={elementid} rowheight={rowheight} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
};
