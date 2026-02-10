import { forwardRef } from "react";

import RowsPhotoAlbum from "../rows";
import ColumnsPhotoAlbum from "../columns";
import MasonryPhotoAlbum from "../masonry";
import type {
  ColumnsPhotoAlbumProps,
  ElementRef,
  ForwardedRef,
  JSXElement,
  LayoutType,
  MasonryPhotoAlbumProps,
  Photo,
  RowsPhotoAlbumProps,
} from "../../types";

type PhotoAlbumProps<TPhoto extends Photo> =
  | ({ layout: Extract<LayoutType, "rows"> } & RowsPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "columns"> } & ColumnsPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "masonry"> } & MasonryPhotoAlbumProps<TPhoto>);

function PhotoAlbum<TPhoto extends Photo>({ layout, ...rest }: PhotoAlbumProps<TPhoto>, ref: ForwardedRef) {
  if (layout === "rows") return <RowsPhotoAlbum ref={ref} {...rest} />;
  if (layout === "columns") return <ColumnsPhotoAlbum ref={ref} {...rest} />;
  if (layout === "masonry") return <MasonryPhotoAlbum ref={ref} {...rest} />;
  return null;
}

export default forwardRef(PhotoAlbum) as <TPhoto extends Photo>(
  props: PhotoAlbumProps<TPhoto> & ElementRef,
) => JSXElement | null;
