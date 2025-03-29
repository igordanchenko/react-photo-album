import { ComponentProps } from "react";
import type { Photo } from "react-photo-album";

type OverlayProps = ComponentProps<"div"> & {
  photo: Photo;
  width: number;
  height: number;
  padding?: string;
};

export default function Overlay({ photo: { src, alt, srcSet }, width, height, padding, style, ...rest }: OverlayProps) {
  return (
    <div style={{ padding, ...style }} {...rest}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={`${width}px`}
        srcSet={srcSet?.map((image) => `${image.src} ${image.width}w`).join(", ")}
      />
    </div>
  );
}
