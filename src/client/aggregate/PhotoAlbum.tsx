import RowsPhotoAlbum from "../rows";
import ColumnsPhotoAlbum from "../columns";
import MasonryPhotoAlbum from "../masonry";
import { ColumnsPhotoAlbumProps, LayoutType, MasonryPhotoAlbumProps, Photo, RowsPhotoAlbumProps } from "../../types";

type PhotoAlbumProps<TPhoto extends Photo> =
  | ({ layout: Extract<LayoutType, "rows"> } & RowsPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "columns"> } & ColumnsPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "masonry"> } & MasonryPhotoAlbumProps<TPhoto>);

export default function PhotoAlbum<TPhoto extends Photo>({ layout, ...rest }: PhotoAlbumProps<TPhoto>) {
  if (layout === "rows") return <RowsPhotoAlbum {...rest} />;
  if (layout === "columns") return <ColumnsPhotoAlbum {...rest} />;
  if (layout === "masonry") return <MasonryPhotoAlbum {...rest} />;
  return null;
}
