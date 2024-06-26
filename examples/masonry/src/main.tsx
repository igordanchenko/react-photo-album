import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <header>
      <h1>React Photo Album | Masonry Layout</h1>
      <a href="https://github.com/igordanchenko/react-photo-album" target="_blank" rel="noreferrer noopener">
        GitHub
      </a>
      <a href="https://react-photo-album.com/" target="_blank" rel="noreferrer noopener">
        Docs
      </a>
    </header>
    <main>
      <App />
    </main>
  </React.StrictMode>,
);
