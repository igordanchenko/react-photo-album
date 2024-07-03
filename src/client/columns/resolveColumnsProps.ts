import { resolveCommonProps, resolveResponsiveParameter } from "../../utils";
import { ColumnsPhotoAlbumProps, Photo } from "../../types";

export default function resolveColumnsProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  { columns, ...rest }: ColumnsPhotoAlbumProps<TPhoto>,
) {
  return {
    ...rest,
    ...resolveCommonProps(containerWidth, rest),
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
  };
}
