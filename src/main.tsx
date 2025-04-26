import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

window.onload = function () {
  const galleries = window?.rid_params?.galleries ?? [];

  for (const gallery of galleries) {
    const { elementid } = gallery;

    const galleryElement = document.getElementById(elementid);
    if (!galleryElement) {
      console.error(`Gallery with ID ${elementid} not found`);
      continue;
    }

    ReactDOM.createRoot(galleryElement).render(
      <React.StrictMode>
        <App {...gallery} />
      </React.StrictMode>
    );
  }
};
