import * as React from "react";

export type LayoutType = "columns" | "rows" | "masonry";

export type PhotoAlbumProps<T extends Photo = Photo> = {
  /** An array of photos to display in the photo album. */
  photos: Array<T>;
  /** Photo album layout type. */
  layout: LayoutType;
  /** A number of columns in the `columns` or `masonry` layout. */
  columns?: ResponsiveParameter;
  /** Spacing between images. */
  spacing?: ResponsiveParameter;
  /** Padding around each image in the photo album. */
  padding?: ResponsiveParameter;
  /** Target row height in the 'rows' layout. */
  targetRowHeight?: ResponsiveParameter;
  /** Additional row constraints in the `rows` layout. */
  rowConstraints?: ResponsiveParameter<RowConstraints>;
  /** Photo album container width at various viewport sizes. */
  sizes?: ResponsiveSizes;
  /** Photo click callback function. */
  onClick?: ClickHandler<T>;
  /** Responsive breakpoints. */
  breakpoints?: number[];
  /** Default container width in SSR. */
  defaultContainerWidth?: number;
  /** Additional HTML attributes to be passed to the rendered elements. */
  componentsProps?: ComponentsPropsParameter;
  /** Custom photo rendering function. */
  renderPhoto?: RenderPhoto<T>;
  /** Custom container rendering function. */
  renderContainer?: RenderContainer;
  /** Custom row container rendering function. */
  renderRowContainer?: RenderRowContainer<T>;
  /** Custom column container rendering function. */
  renderColumnContainer?: RenderColumnContainer<T>;
};

export interface Image {
  /** Image source. */
  src: string;
  /** Image width in pixels. */
  width: number;
  /** Image height in pixels. */
  height: number;
}

export interface Photo extends Image {
  /** Optional `key` attribute. */
  key?: string;
  /** Optional image `alt` attribute. */
  alt?: string;
  /** Optional image `title` attribute. */
  title?: string;
  // TODO v3: remove
  /** @deprecated - use `srcSet` instead */
  images?: Image[];
  /** Optional array of alternative images to be included in the `srcset` attribute. */
  srcSet?: Image[];
}

export type RenderPhotoProps<T extends Photo = Photo> = {
  /** photo object */
  photo: T;
  /** computed photo layout */
  layout: PhotoLayout;
  /** photo album layout options */
  layoutOptions: LayoutOptions<T>;
  /** pre-populated 'img' element attributes */
  imageProps: NonOptional<ImageElementAttributes, "src" | "alt" | "style">;
  /** A callback to render the default photo implementation. If `wrapped` is `true`, the image is styled with `width`
   * and `height` set to 100%. Use this option when rendering image wrapper styled with wrapperStyle. */
  renderDefaultPhoto: RenderFunction<{ wrapped?: boolean } | void>;
  /** CSS styles to properly size image wrapper (i.e. <div> wrapper) */
  wrapperStyle: React.CSSProperties;
};

export type RenderPhoto<T extends Photo = Photo> = RenderFunction<RenderPhotoProps<T>>;

export type ClickHandlerProps<T extends Photo = Photo> = {
  event: React.MouseEvent;
  photo: T;
  index: number;
};

export type ClickHandler<T extends Photo = Photo> = (props: ClickHandlerProps<T>) => void;

export type ResponsiveParameterProvider<T = number> = (containerWidth: number) => T;

export type ResponsiveParameter<T = number> = T | ResponsiveParameterProvider<T>;

export type ResponsiveSizes = {
  /** default size e.g. 100vw or calc(100vw - 200px) */
  size: string;
  /** array of sizes at various breakpoint */
  sizes?: {
    /** viewport size media query e.g. (max-width: 600px)  */
    viewport: string;
    /** photo album width at given viewport size e.g. calc(100vw - 50px) */
    size: string;
  }[];
};

export type PhotoLayout = {
  /** rendered photo width */
  width: number;
  /** rendered photo height */
  height: number;
  /** photo index in the original `photos` array */
  index: number;
  /** photo index in a given row/column */
  photoIndex: number;
  /** number of photos in a given row/column */
  photosCount: number;
};

export type GenericLayoutOptions<T extends Photo = Photo> = {
  /** layout spacing (gaps between photos) */
  spacing: number;
  /** padding around each photo */
  padding: number;
  /** current photo album container width */
  containerWidth: number;
  /** photo click handler */
  onClick?: ClickHandler<T>;
  /** photo album size at various viewport sizes */
  sizes?: ResponsiveSizes;
};

export type RowsLayoutOptions<T extends Photo = Photo> = GenericLayoutOptions<T> & {
  /** layout type */
  layout: Extract<LayoutType, "rows">;
  /** target row height in 'rows' layout */
  targetRowHeight: number;
  /** Additional row constraints */
  rowConstraints?: RowConstraints;
};

export type ColumnsLayoutOptions<T extends Photo = Photo> = GenericLayoutOptions<T> & {
  /** layout type */
  layout: Extract<LayoutType, "columns" | "masonry">;
  /** number of columns in 'columns' or 'masonry' layout */
  columns: number;
};

export type LayoutOptions<T extends Photo = Photo> = ColumnsLayoutOptions<T> | RowsLayoutOptions<T>;

export type RowConstraints = {
  /** minimum number of photos per row in 'rows' layout */
  minPhotos?: number;
  /** maximum number of photos per row in 'rows' layout */
  maxPhotos?: number;
  /** maximum row height when there is not enough photos to fill more than one row */
  singleRowMaxHeight?: number;
};

export type ComponentsProps = {
  /** Additional HTML attributes to be passed to the outer container `div` element */
  containerProps?: DivElementAttributes;
  /** Additional HTML attributes to be passed to the row container `div` element */
  rowContainerProps?: DivElementAttributes;
  /** Additional HTML attributes to be passed to the column container `div` element */
  columnContainerProps?: DivElementAttributes;
  /** Additional HTML attributes to be passed to the photo `img` element */
  imageProps?: ImageElementAttributes;
};

export type ComponentsPropsParameter = ComponentsProps | ((containerWidth?: number) => ComponentsProps);

export type RenderContainerProps = React.PropsWithChildren<{
  /** layout type */
  layout: LayoutType;
  /** pre-populated default container attributes */
  containerProps: DivElementAttributes;
  /** container ref callback */
  containerRef: React.RefCallback<HTMLDivElement>;
}>;

export type RenderContainer = RenderFunction<RenderContainerProps>;

export type RenderRowContainerProps<T extends Photo = Photo> = React.PropsWithChildren<{
  /** layout options */
  layoutOptions: RowsLayoutOptions<T>;
  /** row number */
  rowIndex: number;
  /** total number of rows */
  rowsCount: number;
  /** pre-populated default row container attributes */
  rowContainerProps: DivElementAttributes;
}>;

export type RenderRowContainer<T extends Photo = Photo> = RenderFunction<RenderRowContainerProps<T>>;

export type RenderColumnContainerProps<T extends Photo = Photo> = React.PropsWithChildren<{
  layoutOptions: ColumnsLayoutOptions<T>;
  /** column number */
  columnIndex: number;
  /** total number of columns */
  columnsCount: number;
  /** sum of spacings and paddings in each column */
  columnsGaps?: number[];
  /** width adjustment ratios of each column */
  columnsRatios?: number[];
  /** pre-populated default column container attributes */
  columnContainerProps: DivElementAttributes;
}>;

export type RenderColumnContainer<T extends Photo = Photo> = RenderFunction<RenderColumnContainerProps<T>>;

export type RenderFunction<T = void> = (props: T) => React.ReactNode;

export type DivElementAttributes = React.HTMLAttributes<HTMLDivElement>;

export type ImageElementAttributes = React.ImgHTMLAttributes<HTMLImageElement>;

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type NonOptional<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
