# Columns Layout

Here is a basic example using columns layout.

```tsx
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

import photos from "./photos";

export default function App() {
  return <ColumnsPhotoAlbum photos={photos} />;
}
```

## Live Demo

<LayoutExample layout="columns" />

## Sandbox

<StackBlitzLink href="github/igordanchenko/react-photo-album/tree/main/examples/columns" file="src/App.tsx" title="react-photo-album-columns" description="react-photo-album columns layout" />

## Source Code

<GitHubLink suffix="columns" />
