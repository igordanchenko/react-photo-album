import { clsx } from "../utils";
import StaticPhotoAlbum from "../static";
import computeRowsLayout from "../layouts/rows";
import computeColumnsLayout from "../layouts/columns";
import computeMasonryLayout from "../layouts/masonry";
import resolveRowsProps from "../client/rows/resolveRowsProps";
import resolveColumnsProps from "../client/columns/resolveColumnsProps";
import resolveMasonryProps from "../client/masonry/resolveMasonryProps";
import { StyledBreakpoints, useBreakpoints } from "../ssr/breakpoints";
import {
  ColumnsPhotoAlbumProps,
  LayoutType,
  MasonryPhotoAlbumProps,
  NonOptional,
  Photo,
  RowsPhotoAlbumProps,
} from "../types";

type RowsServerPhotoAlbumProps<TPhoto extends Photo> = NonOptional<
  Omit<RowsPhotoAlbumProps<TPhoto>, "defaultContainerWidth" | "onClick" | "skeleton">,
  "breakpoints"
>;

type ColumnsServerPhotoAlbumProps<TPhoto extends Photo> = NonOptional<
  Omit<ColumnsPhotoAlbumProps<TPhoto>, "defaultContainerWidth" | "onClick" | "skeleton">,
  "breakpoints"
>;

type MasonryServerPhotoAlbumProps<TPhoto extends Photo> = NonOptional<
  Omit<MasonryPhotoAlbumProps<TPhoto>, "defaultContainerWidth" | "onClick" | "skeleton">,
  "breakpoints"
>;

/** ServerPhotoAlbum component props. */
export type ServerPhotoAlbumProps<TPhoto extends Photo> = {
  /** If `true`, do not include the inline stylesheet. */
  unstyled?: boolean;
  /** Custom class names for the container and the breakpoint intervals. */
  classNames?: {
    /** Custom container class name. */
    container?: string;
    /** Custom class names for the breakpoint intervals. */
    breakpoints?: Record<number, string>;
  };
} & (
  | ({ layout: Extract<LayoutType, "rows"> } & RowsServerPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "columns"> } & ColumnsServerPhotoAlbumProps<TPhoto>)
  | ({ layout: Extract<LayoutType, "masonry"> } & MasonryServerPhotoAlbumProps<TPhoto>)
);

/** ServerPhotoAlbum component. */
export default function ServerPhotoAlbum<TPhoto extends Photo>({
  layout,
  unstyled,
  classNames,
  breakpoints: breakpointsProp,
  ...props
}: ServerPhotoAlbumProps<TPhoto>) {
  const { photos } = props;

  const { breakpoints, containerClass, breakpointClass } = useBreakpoints("server", breakpointsProp);

  if (!Array.isArray(photos) || !Array.isArray(breakpoints) || breakpoints.length === 0) return null;

  const computeModel = (breakpoint: number) => {
    if (layout === "rows") {
      const { spacing, padding, targetRowHeight, minPhotos, maxPhotos, ...rest } = resolveRowsProps(breakpoint, props);

      /* v8 ignore else - @preserve */
      if (spacing !== undefined && padding !== undefined && targetRowHeight !== undefined) {
        return {
          ...rest,
          model: computeRowsLayout(photos, spacing, padding, breakpoint, targetRowHeight, minPhotos, maxPhotos),
        };
      }
    }

    if (layout === "columns") {
      const { spacing, padding, columns, ...rest } = resolveColumnsProps(breakpoint, props);

      /* v8 ignore else - @preserve */
      if (spacing !== undefined && padding !== undefined && columns !== undefined) {
        return {
          ...rest,
          model: computeColumnsLayout(photos, spacing, padding, breakpoint, columns),
        };
      }
    }

    if (layout === "masonry") {
      const { spacing, padding, columns, ...rest } = resolveMasonryProps(breakpoint, props);

      /* v8 ignore else - @preserve */
      if (spacing !== undefined && padding !== undefined && columns !== undefined) {
        return {
          ...rest,
          model: computeMasonryLayout(photos, spacing, padding, breakpoint, columns),
        };
      }
    }

    return null;
  };

  return (
    <>
      {!unstyled && (
        <StyledBreakpoints
          breakpoints={breakpoints}
          containerClass={containerClass}
          breakpointClass={breakpointClass}
        />
      )}

      <div className={clsx(containerClass, classNames?.container)}>
        {breakpoints.map((breakpoint) => (
          <div key={breakpoint} className={clsx(breakpointClass(breakpoint), classNames?.breakpoints?.[breakpoint])}>
            <StaticPhotoAlbum layout={layout} {...computeModel(breakpoint)} />
          </div>
        ))}
      </div>
    </>
  );
}
