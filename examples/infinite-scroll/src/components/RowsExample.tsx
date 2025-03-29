import { RowsPhotoAlbum } from "react-photo-album";
import InfiniteScroll from "react-photo-album/scroll";

import photoFetcher from "./photoFetcher";

export default function RowsExample(props: NonNullable<Parameters<typeof photoFetcher>>[0]) {
  return (
    <InfiniteScroll
      fetch={photoFetcher(props)}
      loading={<div className="loading">Loading...</div>}
      finished={<div className="finished">You are all set!</div>}
      error={<div className="error">Failed to fetch photos</div>}
    >
      <RowsPhotoAlbum photos={[]} spacing={20} componentsProps={{ container: { style: { marginBottom: 20 } } }} />
    </InfiniteScroll>
  );
}
