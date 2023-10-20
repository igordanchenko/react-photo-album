import * as React from "react";

import clsx from "../../utils/clsx";
import round from "../../utils/round";
import { ImageElementAttributes, LayoutOptions, Photo, PhotoLayout, RenderPhoto, RenderPhotoProps } from "../../types";

function calcWidth<T extends Photo = Photo>(
  base: string,
  { width, photosCount }: PhotoLayout,
  { spacing, padding, containerWidth }: LayoutOptions<T>,
) {
  const gaps = spacing * (photosCount - 1) + 2 * padding * photosCount;
  return `calc((${base} - ${gaps}px) / ${round((containerWidth - gaps) / width, 5)})`;
}

function cssPhotoWidth<T extends Photo = Photo>(layout: PhotoLayout, layoutOptions: LayoutOptions<T>) {
  return layoutOptions.layout !== "rows"
    ? `calc(100% - ${2 * layoutOptions.padding}px)`
    : calcWidth("100%", layout, layoutOptions);
}

function calculateSizesValue<T extends Photo = Photo>(
  size: string,
  layout: PhotoLayout,
  layoutOptions: LayoutOptions<T>,
) {
  return calcWidth(size.match(/calc\((.*)\)/)?.[1] ?? size, layout, layoutOptions);
}

function srcSetAndSizes<T extends Photo = Photo>(photo: T, layout: PhotoLayout, layoutOptions: LayoutOptions<T>) {
  let srcSet;
  let sizes;

  const images = photo.srcSet || photo.images;
  if (images && images.length > 0) {
    srcSet = images
      .concat(
        !images.find(({ width }) => width === photo.width)
          ? [{ src: photo.src, width: photo.width, height: photo.height }]
          : [],
      )
      .sort((first, second) => first.width - second.width)
      .map((image) => `${image.src} ${image.width}w`)
      .join(", ");
  }

  // always produce image `sizes` attribute when PhotoAlbum `sizes` is present (use case: NextJS image)
  if (layoutOptions.sizes) {
    sizes = (layoutOptions.sizes.sizes || [])
      .map(({ viewport, size }) => `${viewport} ${calculateSizesValue(size, layout, layoutOptions)}`)
      .concat(calculateSizesValue(layoutOptions.sizes.size, layout, layoutOptions))
      .join(", ");
  } else if (srcSet) {
    sizes = `${Math.ceil((layout.width / layoutOptions.containerWidth) * 100)}vw`;
  }

  return { srcSet, sizes };
}

export type PhotoRendererProps<T extends Photo = Photo> = Omit<
  RenderPhotoProps<T>,
  "imageProps" | "renderDefaultPhoto" | "wrapperStyle"
> & {
  imageProps?: ImageElementAttributes;
  renderPhoto?: RenderPhoto<T>;
};

export default function PhotoRenderer<T extends Photo = Photo>(props: PhotoRendererProps<T>) {
  const { photo, layout, layoutOptions, imageProps: { style, className, ...restImageProps } = {}, renderPhoto } = props;
  const { onClick } = layoutOptions;

  const imageStyle = {
    display: "block",
    boxSizing: "content-box",
    width: cssPhotoWidth(layout, layoutOptions),
    height: "auto",
    aspectRatio: `${photo.width} / ${photo.height}`,
    ...(layoutOptions.padding ? { padding: `${layoutOptions.padding}px` } : null),
    ...((layoutOptions.layout === "columns" || layoutOptions.layout === "masonry") &&
    layout.photoIndex < layout.photosCount - 1
      ? { marginBottom: `${layoutOptions.spacing}px` }
      : null),
    ...(onClick ? { cursor: "pointer" } : null),
    ...style,
  } as const;

  const handleClick = onClick
    ? (event: React.MouseEvent) => {
        onClick({ event, photo, index: layout.index });
      }
    : undefined;

  const imageProps = {
    src: photo.src,
    alt: photo.alt ?? "",
    title: photo.title,
    onClick: handleClick,
    style: imageStyle,
    className: clsx("react-photo-album--photo", className),
    loading: "lazy" as const,
    decoding: "async" as const,
    ...srcSetAndSizes(photo, layout, layoutOptions),
    ...restImageProps,
  };

  const renderDefaultPhoto: RenderPhotoProps<T>["renderDefaultPhoto"] = (options) => {
    const { src, alt, srcSet, sizes, style: unwrappedStyle, ...rest } = imageProps;

    return (
      <img
        alt={alt}
        {...(srcSet ? { srcSet, sizes } : null)}
        src={src}
        style={options?.wrapped ? { display: "block", width: "100%", height: "100%" } : unwrappedStyle}
        {...rest}
      />
    );
  };

  const wrapperStyle = (({ display, boxSizing, width, aspectRatio, padding, marginBottom, cursor }) => ({
    display,
    boxSizing,
    width,
    aspectRatio,
    padding,
    marginBottom,
    cursor,
  }))(imageStyle);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {renderPhoto?.({
        photo,
        layout,
        layoutOptions,
        imageProps,
        renderDefaultPhoto,
        wrapperStyle,
      }) ?? renderDefaultPhoto()}
    </>
  );
}
