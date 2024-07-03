import { resolveCommonProps, resolveResponsiveParameter, unwrapParameter } from "../../utils";
import { Photo, RowsPhotoAlbumProps } from "../../types";

export default function resolveRowsProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  { photos, targetRowHeight, rowConstraints, ...rest }: RowsPhotoAlbumProps<TPhoto>,
) {
  const { spacing, padding, componentsProps, render } = resolveCommonProps(containerWidth, rest);
  const { singleRowMaxHeight, minPhotos, maxPhotos } = unwrapParameter(rowConstraints, containerWidth) || {};

  if (singleRowMaxHeight !== undefined && spacing !== undefined && padding !== undefined) {
    const maxWidth = Math.floor(
      photos.reduce(
        (acc, { width, height }) => acc + (width / height) * singleRowMaxHeight - 2 * padding,
        padding * photos.length * 2 + spacing * (photos.length - 1),
      ),
    );

    if (maxWidth > 0) {
      componentsProps.container = { ...componentsProps.container };
      componentsProps.container.style = { maxWidth, ...componentsProps.container.style };
    }
  }

  return {
    ...rest,
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
      (w) => w / 5,
      (w) => w / 4,
      (w) => w / 3,
      (w) => w / 2,
    ]),
    render,
    spacing,
    padding,
    minPhotos,
    maxPhotos,
    componentsProps,
  };
}
