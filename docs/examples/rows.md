# Rows Layout

Here is a basic example using rows layout.

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import photos from "./photos";

export default function App() {
  return <RowsPhotoAlbum photos={photos} />;
}
```

## Live Demo

<LayoutExample layout="rows" />

## Sandbox

<StackBlitzLink href="github/igordanchenko/react-photo-album/tree/next/examples/rows" file="src/App.tsx" title="react-photo-album-rows" description="react-photo-album rows layout" />

## Source Code

<GitHubLink suffix="rows" />
