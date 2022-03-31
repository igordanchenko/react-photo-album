import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("root container not found");

createRoot(container).render(
    <StrictMode>
        <header>
            <h1>React Photo Album | Sortable Gallery</h1>
            <a href="https://github.com/igordanchenko/react-photo-album" target="_blank" rel="noreferrer noopener">
                GitHub
            </a>
            <a href="https://react-photo-album.com/" target="_blank" rel="noreferrer noopener">
                Docs
            </a>
            <p>You can re-arrange photos via drag-and-drop</p>
        </header>
        <main>
            <App />
        </main>
    </StrictMode>
);
