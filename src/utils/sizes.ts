import round from "./round";
import type { Photo, ResponsiveSizes } from "../types";

export default function srcSetAndSizes(
  photo: Photo,
  responsiveSizes: ResponsiveSizes | undefined,
  photoWidth: number,
  containerWidth: number,
  photosCount: number,
  spacing: number,
  padding: number,
) {
  let srcSet;
  let sizes;

  const calcSizes = (base: string) => {
    const gaps = spacing * (photosCount - 1) + 2 * padding * photosCount;
    return `calc((${base.match(/^\s*calc\((.*)\)\s*$/)?.[1] ?? base} - ${gaps}px) / ${round((containerWidth - gaps) / photoWidth, 5)})`;
  };

  const images = photo.srcSet;
  if (images && images.length > 0) {
    srcSet = images
      .concat(
        !images.some(({ width }) => width === photo.width)
          ? [{ src: photo.src, width: photo.width, height: photo.height }]
          : [],
      )
      .sort((first, second) => first.width - second.width)
      .map((image) => `${image.src} ${image.width}w`)
      .join(", ");
  }

  // always produce image `sizes` attribute (use case: NextJS image)
  if (responsiveSizes?.size) {
    // produce more accurate estimate when `sizes` attribute is present
    sizes = (responsiveSizes.sizes || [])
      .map(({ viewport, size }) => `${viewport} ${calcSizes(size)}`)
      .concat(calcSizes(responsiveSizes.size))
      .join(", ");
  } else {
    // produce rough approximation by default
    // round before ceil so that floating-point noise in photoWidth doesn't bump the estimate:
    // a photo spanning the full container can land an ulp above containerWidth and must still
    // yield 100vw, not 101vw; 3 decimals sits well above that noise and well below the 1vw ceil
    // granularity (worst-case understatement is half a granule, 0.0005vw), and matches the
    // width/height precision exposed by PhotoComponent
    sizes = `${Math.ceil(round((photoWidth / containerWidth) * 100, 3))}vw`;
  }

  return { srcSet, sizes };
}
