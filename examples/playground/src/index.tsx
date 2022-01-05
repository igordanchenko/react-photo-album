import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <header>
            <h1>React Photo Album | Playground</h1>
            <a href="https://github.com/igordanchenko/react-photo-album" rel="noreferrer noopener">
                GitHub
            </a>
            <a href="https://react-photo-album.com/" rel="noreferrer noopener">
                Docs
            </a>
        </header>
        <main>
            <App />
        </main>
    </React.StrictMode>,
    document.getElementById("root")
);
