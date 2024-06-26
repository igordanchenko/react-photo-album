# Masonry Layout

Here is a basic example using masonry layout.

```tsx
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

import photos from "./photos";

export default function App() {
  return <MasonryPhotoAlbum photos={photos} />;
}
```

## Live Demo

<LayoutExample layout="masonry" />

## Sandbox

<StackBlitzLink href="github/igordanchenko/react-photo-album/tree/next/examples/masonry" file="src/App.tsx" title="react-photo-album-masonry" description="react-photo-album masonry layout" />

## Source Code

<GitHubLink suffix="masonry" />
