import { resolveCommonProps, resolveResponsiveParameter } from "../../core/utils";
import { MasonryPhotoAlbumProps, Photo } from "../../types";

export default function resolveMasonryProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  { columns, ...rest }: MasonryPhotoAlbumProps<TPhoto>,
) {
  return {
    ...rest,
    ...resolveCommonProps(containerWidth, rest),
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
  };
}
