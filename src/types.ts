import type React from "react";

/** Layout type */
export type LayoutType = "rows" | "columns" | "masonry";

/** Photo object */
export interface Photo extends Image {
  /** React `key` attribute. */
  key?: string;
  /** Image `alt` attribute. */
  alt?: string;
  /** Image `title` attribute. */
  title?: string;
  /** Image link URL. */
  href?: string;
  /** ARIA label for the link and button elements */
  label?: string;
  /** Optional array of alternative images to be included in the `srcset` attribute. */
  srcSet?: Image[];
}

/** Image object */
export interface Image {
  /** Image source. */
  src: string;
  /** Image width in pixels. */
  width: number;
  /** Image height in pixels. */
  height: number;
}

/** Common photo album props */
export interface CommonPhotoAlbumProps<TPhoto extends Photo = Photo> {
  /** An array of photos to display in the photo album. */
  photos: TPhoto[];
  /** Spacing between images. */
  spacing?: ResponsiveParameter;
  /** Padding around each image. */
  padding?: ResponsiveParameter;
  /** Photo album container width in various viewports. */
  sizes?: ResponsiveSizes;
  /** Photo album layout breakpoints. */
  breakpoints?: number[];
  /** Default container width in SSR. */
  defaultContainerWidth?: number;
  /** Photo click callback. */
  onClick?: (props: ClickHandlerProps<TPhoto>) => void;
  /** Custom render functions. */
  render?: ResponsiveParameter<Render<TPhoto>>;
  /** Additional HTML attributes to be passed to the rendered elements. */
  componentsProps?: ComponentsProps<TPhoto> | ((containerWidth?: number) => ComponentsProps<TPhoto>);
  /** Fallback skeleton in SSR. */
  skeleton?: React.ReactNode;
}

/** Rows photo album props */
export interface RowsPhotoAlbumProps<TPhoto extends Photo = Photo> extends CommonPhotoAlbumProps<TPhoto> {
  /** Target row height. */
  targetRowHeight?: ResponsiveParameter;
  /** Additional row constraints. */
  rowConstraints?: ResponsiveParameter<RowConstraints>;
}

/** Columns photo album props */
export interface ColumnsPhotoAlbumProps<TPhoto extends Photo = Photo> extends CommonPhotoAlbumProps<TPhoto> {
  /** Number of columns. */
  columns?: ResponsiveParameter;
}

/** Masonry photo album props */
export interface MasonryPhotoAlbumProps<TPhoto extends Photo = Photo> extends ColumnsPhotoAlbumProps<TPhoto> {}

/** Photo album sizes settings */
export type ResponsiveSizes = {
  /** Default size, e.g. `100vw` or `calc(100vw - 200px)`. */
  size: string;
  /** Array of sizes at various breakpoints. */
  sizes?: {
    /** Viewport size media query, e.g. `(max-width: 600px)`.  */
    viewport: string;
    /** Photo album width at a given viewport size, e.g. `calc(100vw - 50px)`. */
    size: string;
  }[];
};

/** Row constraints */
export type RowConstraints = {
  /** Minimum number of photos per row. */
  minPhotos?: number;
  /** Maximum number of photos per row. */
  maxPhotos?: number;
  /** Maximum row height when there is not enough photos to fill more than one row. */
  singleRowMaxHeight?: number;
};

/** Layout model */
export type LayoutModel<TPhoto extends Photo = Photo> = {
  /** Spacing value. */
  spacing: number;
  /** Padding value. */
  padding: number;
  /** Container width. */
  containerWidth: number;
  /** Layout variables. */
  variables?: LayoutVariables;
  /** Layout orientation. */
  horizontal?: boolean;
  /** Layout tracks. */
  tracks: {
    /** Track variables. */
    variables?: LayoutVariables;
    /** Photos array. */
    photos: {
      /** Photo object. */
      photo: TPhoto;
      /** Photo index in the original `photos` array. */
      index: number;
      /** Rendered photo width in pixels. */
      width: number;
      /** Rendered photo height in pixels. */
      height: number;
    }[];
  }[];
};

/** Layout variables */
export type LayoutVariables = { [key: string]: string | number | undefined };

/** Responsive parameter */
export type ResponsiveParameter<Value = number> = Value | ((containerWidth: number) => Value);

/** Custom render functions */
export type Render<TPhoto extends Photo = Photo> = {
  /** Custom container render function. */
  container?: RenderFunction<RenderContainerProps>;
  /** Custom track render function. */
  track?: RenderFunction<RenderTrackProps>;
  /** Custom wrapper render function. */
  wrapper?: RenderFunction<RenderWrapperProps, RenderWrapperContext<TPhoto>>;
  /** Custom link render function. */
  link?: RenderFunction<RenderLinkProps, RenderLinkContext<TPhoto>>;
  /** Custom button render function. */
  button?: RenderFunction<RenderButtonProps, RenderButtonContext<TPhoto>>;
  /** Custom image render function. */
  image?: RenderFunction<RenderImageProps, RenderImageContext<TPhoto>>;
  /** Custom photo render function. */
  photo?: RenderFunction<RenderPhotoProps, RenderPhotoContext<TPhoto>>;
  /** Custom extra markup render function. */
  extras?: RenderFunction<{}, RenderPhotoContext<TPhoto>>;
};

/** Components props */
export type ComponentsProps<TPhoto extends Photo = Photo> = {
  /** Additional HTML attributes for the outer `<div>` container. */
  container?: React.ComponentPropsWithoutRef<"div">;
  /** Additional HTML attributes for the row / column `<div>` container. */
  track?: React.ComponentPropsWithoutRef<"div">;
  /** Additional HTML attributes for the image `<div>` wrapper. */
  wrapper?: ContextAware<React.ComponentPropsWithoutRef<"div">, RenderWrapperContext<TPhoto>>;
  /** Additional HTML attributes for the photo `<a>` link. */
  link?: ContextAware<React.ComponentPropsWithoutRef<"a">, RenderLinkContext<TPhoto>>;
  /** Additional HTML attributes for the photo `<button>` element. */
  button?: ContextAware<React.ComponentPropsWithoutRef<"button">, RenderButtonContext<TPhoto>>;
  /** Additional HTML attributes for the photo `<img>` element. */
  image?: ContextAware<React.ComponentPropsWithoutRef<"img">, RenderImageContext<TPhoto>>;
};

/** Click callback props */
export type ClickHandlerProps<TPhoto extends Photo = Photo> = {
  /** Click event. */
  event: React.MouseEvent;
  /** Photo object. */
  photo: TPhoto;
  /** Photo index in the original `photos` array. */
  index: number;
};

export type RenderContainerProps = React.ComponentPropsWithRef<"div">;

export type RenderTrackProps = React.ComponentPropsWithoutRef<"div">;

export type RenderWrapperProps = React.ComponentPropsWithoutRef<"div">;

export type RenderWrapperContext<TPhoto extends Photo = Photo> = RenderPhotoContext<TPhoto>;

export type RenderLinkProps = NonOptional<React.ComponentPropsWithoutRef<"a">, "href">;

export type RenderLinkContext<TPhoto extends Photo = Photo> = RenderPhotoContext<TPhoto>;

export type RenderButtonProps = React.ComponentPropsWithoutRef<"button">;

export type RenderButtonContext<TPhoto extends Photo = Photo> = RenderPhotoContext<TPhoto>;

export type RenderImageProps = NonOptional<React.ComponentPropsWithoutRef<"img">, "src">;

export type RenderImageContext<TPhoto extends Photo = Photo> = RenderPhotoContext<TPhoto>;

/** Render photo props */
export type RenderPhotoProps = {
  /** Click callback. */
  onClick?: React.MouseEventHandler;
};

/** Render photo context */
export type RenderPhotoContext<TPhoto extends Photo = Photo> = {
  /** Photo object. */
  photo: TPhoto;
  /** Photo index in the original `photos` array. */
  index: number;
  /** Rendered photo width in pixels. */
  width: number;
  /** Rendered photo height in pixels. */
  height: number;
};

/** Render function */
export type RenderFunction<Props extends {} | void = void, Context extends {} | void = void> = [Context] extends [void]
  ? [Props] extends [void]
    ? () => React.ReactNode
    : (
        /** Component props. */
        props: Props,
      ) => React.ReactNode
  : [Props] extends [void]
    ? never
    : (
        /** Component props. */
        props: Props,
        /** Rendering context. */
        context: Context,
      ) => React.ReactNode;

export type NonOptional<Props, Keys extends keyof Props> = Required<Pick<Props, Keys>> & Omit<Props, Keys>;

export type ContextAware<Props, Context> = Props | ((context: Context) => Props | undefined);

export type JSXElement = React.JSX.Element;

export type ForwardedRef<T extends HTMLElement = HTMLElement> = React.ForwardedRef<T>;

export type ElementRef<T extends HTMLElement = HTMLElement> = {
  ref?: React.Ref<T>;
};
