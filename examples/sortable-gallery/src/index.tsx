import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
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
    </React.StrictMode>,
    document.getElementById("root")
);
