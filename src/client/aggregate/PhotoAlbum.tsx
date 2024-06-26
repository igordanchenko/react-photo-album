import RowsPhotoAlbum from "../rows";
import ColumnsPhotoAlbum from "../columns";
import MasonryPhotoAlbum from "../masonry";
import { ColumnsPhotoAlbumProps, MasonryPhotoAlbumProps, Photo, RowsPhotoAlbumProps } from "../../types";

type PhotoAlbumProps<TPhoto extends Photo> =
  | ({ layout: "rows" } & RowsPhotoAlbumProps<TPhoto>)
  | ({ layout: "columns" } & ColumnsPhotoAlbumProps<TPhoto>)
  | ({ layout: "masonry" } & MasonryPhotoAlbumProps<TPhoto>);

export default function PhotoAlbum<TPhoto extends Photo>({ layout, ...rest }: PhotoAlbumProps<TPhoto>) {
  if (layout === "rows") return <RowsPhotoAlbum {...rest} />;
  if (layout === "columns") return <ColumnsPhotoAlbum {...rest} />;
  if (layout === "masonry") return <MasonryPhotoAlbum {...rest} />;
  return null;
}
