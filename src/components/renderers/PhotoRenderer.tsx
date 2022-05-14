import { CSSProperties, HTMLAttributes, MouseEvent } from "react";

import round from "../../utils/round";
import { LayoutOptions, Photo, PhotoLayout, PhotoProps, RenderPhoto } from "../../types";

const calcWidth = <T extends Photo = Photo>(
    base: string,
    { width, photosCount }: PhotoLayout,
    { spacing, padding, containerWidth }: LayoutOptions<T>
) => {
    const gaps = spacing * (photosCount - 1) + 2 * padding * photosCount;
    return `calc((${base} - ${gaps}px) / ${round((containerWidth - gaps) / width, 5)})`;
};

const cssWidth = <T extends Photo = Photo>(layout: PhotoLayout, layoutOptions: LayoutOptions<T>) => {
    if (layoutOptions.layout !== "rows") {
        return `calc(100% - ${2 * layoutOptions.padding}px)`;
    }
    return calcWidth("100%", layout, layoutOptions);
};

const calculateSizesValue = <T extends Photo = Photo>(
    size: string,
    layout: PhotoLayout,
    layoutOptions: LayoutOptions<T>
) => calcWidth(size.match(/calc\((.*)\)/)?.[1] ?? size, layout, layoutOptions);

const srcSetAndSizes = <T extends Photo = Photo>(photo: T, layout: PhotoLayout, layoutOptions: LayoutOptions<T>) => {
    let srcSet, sizes;

    if (photo.images && photo.images.length > 0) {
        srcSet = photo.images
            .concat([
                {
                    src: photo.src,
                    width: photo.width,
                    height: photo.height,
                },
            ])
            .sort((first, second) => first.width - second.width)
            .map((image) => `${image.src} ${image.width}w`)
            .join(", ");
    }

    if (layoutOptions.sizes) {
        sizes = (layoutOptions.sizes.sizes || [])
            .map(({ viewport, size }) => `${viewport} ${calculateSizesValue(size, layout, layoutOptions)}`)
            .concat(calculateSizesValue(layoutOptions.sizes.size, layout, layoutOptions))
            .join(", ");
    } else {
        sizes = `${Math.ceil((layout.width / (layoutOptions.viewportWidth || layoutOptions.containerWidth)) * 100)}vw`;
    }

    return { srcSet, sizes };
};

const defaultRenderPhoto = <T extends Photo = Photo>({ imageProps }: PhotoProps<T>) => {
    const { src, alt, srcSet, sizes, ...rest } = imageProps;
    return <img alt={alt} {...(srcSet ? { srcSet, sizes } : null)} src={src} {...rest} />;
};

type PhotoRendererProps<T extends Photo = Photo> = Omit<PhotoProps<T>, "imageProps"> & {
    imageProps?: HTMLAttributes<HTMLImageElement>;
} & { renderPhoto?: RenderPhoto<T> };

const PhotoRenderer = <T extends Photo = Photo>(props: PhotoRendererProps<T>) => {
    const { photo, layout, layoutOptions, imageProps: { style, ...restImageProps } = {}, renderPhoto } = props;
    const { onClick } = layoutOptions;

    const imageStyle = {
        display: "block",
        boxSizing: "content-box",
        width: cssWidth(layout, layoutOptions),
        height: "auto",
        aspectRatio: `${photo.width} / ${photo.height}`,
        ...(layoutOptions.padding ? { padding: `${layoutOptions.padding}px` } : null),
        ...((layoutOptions.layout === "columns" || layoutOptions.layout === "masonry") &&
        layout.photoIndex < layout.photosCount - 1
            ? { marginBottom: `${layoutOptions.spacing}px` }
            : null),
        ...(onClick ? { cursor: "pointer" } : null),
        ...style,
    } as CSSProperties;

    const handleClick = onClick
        ? (event: MouseEvent) => {
              onClick(event, photo, layout.index);
          }
        : undefined;

    const imageProps = {
        src: photo.src,
        alt: photo.alt ?? "",
        title: photo.title,
        onClick: handleClick,
        style: imageStyle,
        className: "react-photo-album--photo",
        ...srcSetAndSizes(photo, layout, layoutOptions),
        ...restImageProps,
    };

    return (renderPhoto ?? defaultRenderPhoto)({ photo, layout, layoutOptions, imageProps });
};

export default PhotoRenderer;
