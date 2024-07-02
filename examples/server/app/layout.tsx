import type React from "react";

import "@/app/globals.css";

export const metadata = {
  title: "React Photo Album - Server Component",
  description: "React Photo Album - Server Component",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>React Photo Album | Server Component</h1>
          <a href="https://github.com/igordanchenko/react-photo-album" target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <a href="https://react-photo-album.com/" target="_blank" rel="noreferrer noopener">
            Docs
          </a>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
