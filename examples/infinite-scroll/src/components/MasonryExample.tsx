import { MasonryPhotoAlbum } from "react-photo-album";
import { UnstableInfiniteScroll as InfiniteScroll } from "react-photo-album/scroll";

import photoFetcher from "./photoFetcher";

export default function RowsExample(props: NonNullable<Parameters<typeof photoFetcher>>[0]) {
  return (
    <InfiniteScroll
      singleton
      fetch={photoFetcher(props)}
      loading={<div className="loading">Loading...</div>}
      finished={<div className="finished">You are all set!</div>}
      error={<div className="error">Failed to fetch photos</div>}
    >
      <MasonryPhotoAlbum photos={[]} spacing={20} componentsProps={{ container: { style: { marginBottom: 20 } } }} />
    </InfiniteScroll>
  );
}
