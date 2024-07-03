# Documentation

[React Photo Album](/) allows you to build a responsive React photo gallery in
minutes. To get started, follow the [Installation](/#Installation) and
[Minimal Setup Example](/#MinimalSetupExample) guides, or feel free to explore
the collection of [examples](/examples) with live demos.

Parameters marked with an asterisk (<span class="required" />) are required.

## Prerequisites

[React Photo Album](/) provides four separate photo album components, depending
on the layout you intend to use. Each component comes with its own CSS
stylesheet.

### Rows Layout

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
```

### Columns Layout

```tsx
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
```

### Masonry Layout

```tsx
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
```

### 3-in-1

If you use more than one layout in our app, you may opt for the aggregate
component, which bundles all three layouts.

```tsx
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
```

## Common Props

The following props are applicable to all three layouts.

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">photos</span></td>
      <td>Photo[]</td>
      <td>
        An array of photos to display in the photo album.
        See [Photo](#Photo) for details.
      </td>
    </tr>
    <tr>
      <td>spacing</td>
      <td>number | function</td>
      <td>
        <p>Spacing between images (similar to CSS grid gap).</p>
        <p>Default responsive value:</p>
        <ul>
          <li>20, when container width >= 1200</li>
          <li>15, when container width >= 600 and &lt; 1200</li>
          <li>10, when container width >= 300 and &lt; 600</li>
          <li>5, when container width &lt; 300</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>padding</td>
      <td>number | function</td>
      <td>
        <p>Padding around each image.</p>
        <p>Default value: <span class="font-mono">0</span></p>
      </td>
    </tr>
    <tr>
      <td>onClick</td>
      <td>function</td>
      <td>Photo click callback. See [Click Handler](#ClickHandler) for details.</td>
    </tr>
    <tr>
      <td>sizes</td>
      <td>object</td>
      <td>
        <p>
          Photo album container width in various viewports. See [Sizes](#Sizes) 
          for details.
        </p>
      </td>
    </tr>
    <tr>
      <td>breakpoints</td>
      <td>number[]</td>
      <td>
        Photo album layout breakpoints. See [Breakpoints](#Breakpoints) for details.
      </td>
    </tr>
    <tr>
      <td>componentsProps</td>
      <td>object | function</td>
      <td>
        Additional HTML attributes to be passed to the rendered elements.
        See [Components Props](#ComponentsProps) for details.
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>object | function</td>
      <td>
        Custom render functions. See [Render Functions](#RenderFunctions) for details.
      </td>
    </tr>
    <tr>
      <td>defaultContainerWidth</td>
      <td>number</td>
      <td>
        The default container width in server-side rendering (SSR).
        See [Default Container Width](#Server-SideRendering(SSR)_DefaultContainerWidth) for details.
      </td>
    </tr>
    <tr>
      <td>skeleton</td>
      <td>ReactNode</td>
      <td>
        Fallback skeleton in SSR. 
        See [Skeleton](#Server-SideRendering(SSR)_Skeleton) for details.
      </td>
    </tr>
  </tbody>
</table>

## RowsPhotoAlbum Props

<table class="docs">
  <tbody>
    <tr>
      <td>targetRowHeight</td>
      <td>number | function</td>
      <td>
        <p>Target row height.</p>
        <p>Default responsive value:</p>
        <ul>
          <li>(container width) / 5, when container width >= 1200</li>
          <li>(container width) / 4, when container width >= 600 and &lt; 1200</li>
          <li>(container width) / 5, when container width >= 300 and &lt; 600</li>
          <li>(container width) / 2, when container width &lt; 300</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>rowConstraints</td>
      <td>object | function</td>
      <td>
        <p>Additional row constraints.</p>
        <ul>
          <li>`minPhotos` - minimum number of photos per row</li>
          <li>`maxPhotos` - maximum number of photos per row</li>
          <li>
            `singleRowMaxHeight` - maximum row height when there is not enough 
            photos to fill more than one row
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Usage example:

```tsx
<RowsPhotoAlbum
  photos={photos}
  targetRowHeight={150}
  rowConstraints={{ singleRowMaxHeight: 250 }}
/>
```

## ColumnsPhotoAlbum Props

<table class="docs">
  <tbody>
    <tr>
      <td>columns</td>
      <td>number | function</td>
      <td>
        <p>Number of columns.</p>
        <p>Default responsive value:</p>
        <ul>
          <li>5, when container width >= 1200</li>
          <li>4, when container width >= 600 and &lt; 1200</li>
          <li>3, when container width >= 300 and &lt; 600</li>
          <li>2, when container width &lt; 300</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Usage example:

```tsx
<ColumnsPhotoAlbum photos={photos} columns={4} />
```

## MasonryPhotoAlbum Props

`MasonryPhotoAlbum` accepts `columns` prop identical to the one supported by the
[ColumnsPhotoAlbum](#ColumnsPhotoAlbumProps).

Usage example:

```tsx
<MasonryPhotoAlbum photos={photos} columns={4} />
```

## PhotoAlbum Props

The aggregate `PhotoAlbum` component supports all relevant props that correspond
to the selected layout.

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">layout</span></td>
      <td>"columns" | "rows" | "masonry"</td>
      <td>Photo album layout type.</td>
    </tr>
  </tbody>
</table>

Usage example:

```tsx
<PhotoAlbum layout="rows" photos={photos} targetRowHeight={150} />
```

## Photo

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">src</span></td>
      <td>string</td>
      <td>Image source.</td>
    </tr>
    <tr>
      <td><span class="required">width</span></td>
      <td>number</td>
      <td>Image width in pixels.</td>
    </tr>
    <tr>
      <td><span class="required">height</span></td>
      <td>number</td>
      <td>Image height in pixels.</td>
    </tr>
    <tr>
      <td>key</td>
      <td>string</td>
      <td>React `key` attribute.</td>
    </tr>
    <tr>
      <td>alt</td>
      <td>string</td>
      <td>Image `alt` attribute.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>Image `title` attribute.</td>
    </tr>
    <tr>
      <td>href</td>
      <td>string</td>
      <td>Image link URL.</td>
    </tr>
    <tr>
      <td>label</td>
      <td>string</td>
      <td>ARIA label for the link and button elements.</td>
    </tr>
    <tr>
      <td>srcSet</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;src:&nbsp;string;<br />
        &nbsp;&nbsp;width:&nbsp;number;<br />
        &nbsp;&nbsp;height:&nbsp;number;<br />
        &#125;[]
      </td>
      <td>
        <p>
          Optional array of alternative images to be included in the `srcset` attribute.
        </p>
        <p>All images in a given `Photo` object must be of the same aspect ratio.</p>
      </td>
    </tr>
  </tbody>
</table>

You can also provide custom photo attributes and access them in the render
functions.

## Click Handler

You can add interactive behavior by providing the `onClick` callback.

```tsx
<RowsPhotoAlbum
  photos={photos}
  onClick={({ index }) => {
    openLightbox(index);
  }}
/>
```

The callback function accepts a single parameter with the following props:

<table class="docs">
  <tbody>
    <tr>
      <td>index</td>
      <td>number</td>
      <td>Photo index in the original `photos` array.</td>
    </tr>
    <tr>
      <td>photo</td>
      <td>Photo</td>
      <td>Photo object.</td>
    </tr>
    <tr>
      <td>event</td>
      <td>MouseEvent</td>
      <td>Corresponding mouse event.</td>
    </tr>
  </tbody>
</table>

## Responsive Props

[React Photo Album](/) accepts various props as responsive parameters.

Responsive props can be provided either as a hard-coded value:

```tsx
<ColumnsPhotoAlbum photos={photos} columns={3} />
```

or as a function of container width:

```tsx
<ColumnsPhotoAlbum
  photos={photos}
  columns={(containerWidth) => {
    if (containerWidth < 400) return 2;
    if (containerWidth < 800) return 3;
    return 4;
  }}
/>
```

## Components Props

You can pass additional HTML attributes to the rendered elements through the
`componentsProps` parameter.

<table class="docs">
  <tbody>
    <tr>
      <td>container</td>
      <td>ComponentProps&lt;"div"&gt;</td>
      <td>Additional HTML attributes for the outer `div` container.</td>
    </tr>
    <tr>
      <td>track</td>
      <td>ComponentProps&lt;"div"&gt;</td>
      <td>Additional HTML attributes for the row / column `div` containers.</td>
    </tr>
    <tr>
      <td>wrapper</td>
      <td>ComponentProps&lt;"div"&gt;</td>
      <td>Additional HTML attributes for the image `div` wrapper.</td>
    </tr>
    <tr>
      <td>link</td>
      <td>ComponentProps&lt;"a"&gt;</td>
      <td>Additional HTML attributes for the photo `a` link.</td>
    </tr>
    <tr>
      <td>button</td>
      <td>ComponentProps&lt;"button"&gt;</td>
      <td>Additional HTML attributes for the photo `button` element.</td>
    </tr>
    <tr>
      <td>image</td>
      <td>ComponentProps&lt;"img"&gt;</td>
      <td>
        <p>Additional HTML attributes for the photo `img` element.</p>
        <p>
          Default: <span class="font-mono">&#123; loading: "lazy", decoding: "async"&#125;</span>
        </p>
      </td>
    </tr>
  </tbody>
</table>

Usage example:

```tsx
<RowsPhotoAlbum
  photos={photos}
  componentsProps={(containerWidth) => ({
    image: { loading: (containerWidth || 0) > 600 ? "eager" : "lazy" },
  })}
/>
```

## Render Functions

[React Photo Album](/) allows you to customize all rendered elements by
supplying your own custom render functions. Each render function provides the
default element's props as a first parameter. These typically include `style`
and `className` attributes the default implementation requires.

<table class="docs">
  <tbody>
    <tr>
      <td>container</td>
      <td>(props) =&gt; ReactNode</td>
      <td>
        Render custom container. 
        See [Container](#RenderFunctions_Container) for details.
      </td>
    </tr>
    <tr>
      <td>track</td>
      <td>(props) =&gt; ReactNode</td>
      <td>
        Render custom row / column container.
        See [Track](#RenderFunctions_Track) for details.
      </td>
    </tr>
    <tr>
      <td>wrapper</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom image wrapper.
        See [Wrapper](#RenderFunctions_Wrapper) for details.
      </td>
    </tr>
    <tr>
      <td>link</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom link element.
        See [Link](#RenderFunctions_Link) for details.
      </td>
    </tr>
    <tr>
      <td>button</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom button element.
        See [Button](#RenderFunctions_Button) for details.
      </td>
    </tr>
    <tr>
      <td>image</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom image element.
        See [Image](#RenderFunctions_Image) for details.
      </td>
    </tr>
    <tr>
      <td>extras</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom markup immediately after each image.
        See [Extras](#RenderFunctions_Extras) for details.
      </td>
    </tr>
    <tr>
      <td>photo</td>
      <td>(props, context) =&gt; ReactNode</td>
      <td>
        Render custom photo.
        See [Photo](#RenderFunctions_Photo) for details.
      </td>
    </tr>
  </tbody>
</table>

When applicable, the second parameter represents the photo rendering context.

<table class="docs">
  <tbody>
    <tr>
      <td>photo</td>
      <td>Photo</td>
      <td>Photo object.</td>
    </tr>
    <tr>
      <td>index</td>
      <td>number</td>
      <td>Photo index in the original `photos` array.</td>
    </tr><tr>
      <td>width</td>
      <td>number</td>
      <td>Rendered photo width in pixels.</td>
    </tr>
    <tr>
      <td>height</td>
      <td>number</td>
      <td>Rendered photo height in pixels.</td>
    </tr>
  </tbody>
</table>

### Container

You can customize the photo album `div` container through the `render.container`
prop. Your implementation must forward `ref` attribute to the underlying
container element.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    container: ({ ref, ...rest }) => <div ref={ref} {...rest} />,
  }}
/>
```

### Track

You can customize the row / column `div` containers through the `render.track`
prop. This is not common.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    track: (props) => <div {...props} />,
  }}
/>
```

### Wrapper

You can customize the image wrapper through the `render.wrapper` prop. This
wrapper is rendered only when photos are not clickable (there is no `href` photo
prop and no `onClick` callback). This is not common.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    wrapper: (props) => <div {...props} />,
  }}
/>
```

### Link

Link element is rendered when a photo has an `href` attribute. You can provide
your own link implementation through the `render.link` prop.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    link: (props) => <a {...props} />,
  }}
/>
```

### Button

Button element is rendered when the photo album has an `onClick` callback. You
can provide your own button implementation through the `render.button` prop.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    button: (props) => <button {...props} />,
  }}
/>
```

### Image

You can provide your own image implementation through the `render.image` prop.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    image: (props) => <img {...props} />,
  }}
/>
```

### Extras

You can render custom elements alongside each photo. This can be useful for
rendering interactive icons with `position: absolute`.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    extras: (_, { photo, index }) => (
      <FavoriteIcon photo={photo} index={index} />
    ),
  }}
/>
```

### Photo

This is the render function that completely overrides the default `wrapper`,
`link`, `button`, `image` and `extras` render functions. The only prop provided
in the first argument, is the `onClick` callback.

```tsx
<RowsPhotoAlbum
  photos={photos}
  render={{
    photo: ({ onClick }, { photo, width, height }) => (
      <CustomPhoto
        photo={photo}
        width={width}
        height={height}
        onClick={onClick}
      />
    ),
  }}
/>
```

## Breakpoints

By default, [React Photo Album](/) re-calculates its layout every time its
container width changes. For example, the layout may be re-calculated dozens of
times during a browser window resize. If this behavior is undesired, you can
avoid it by providing the `breakpoints` prop (e.g.,
<span class="font-mono">[300, 600, 1200]</span>). When the `breakpoints`
parameter is defined, [React Photo Album](/) calculates the layout only once per
the breakpoint interval.

```tsx
<RowsPhotoAlbum photos={photos} breakpoints={[300, 600, 1200]} />
```

## Sizes

Photo album components automatically generate `sizes` and `srcset` image
attributes when photo objects contain `srcSet` array. By default,
[React Photo Album](/) assumes that the photo album utilizes approximately
<span class="font-mono">100vw</span> of the page width. If that's not the case,
you can improve the performance of your responsive images by describing your
photo album size in different viewports.

For example, this website uses the following `sizes` attribute to account for
the content container padding and the left-hand side navigation menu:

```tsx
<RowsPhotoAlbum
  photos={photos}
  sizes={{
    size: "992px",
    sizes: [
      { viewport: "(max-width: 767px)", size: "calc(100vw - 32px)" },
      { viewport: "(max-width: 1279px)", size: "calc(100vw - 288px)" },
    ],
  }}
/>
```

## Infinite Scroll

You can use the experimental `InfiniteScroll` component to implement an infinite
scroll feature in your app. The component is currently exported as
`UnstableInfiniteScroll`. Please share your feedback if you have successfully
used this component in your project or encountered any issues.

```tsx
import { UnstableInfiniteScroll as InfiniteScroll } from "react-photo-album/scroll";
```

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">children</span></td>
      <td>ReactElement</td>
      <td>Photo album component. Must be the only child.</td>
    </tr>
    <tr>
      <td><span class="required">fetch</span></td>
      <td>(index: number) =&gt; Promise&lt;Photo[] | null&gt;</td>
      <td>Photo fetcher. Resolve promise with `null` to indicate end of stream.</td>
    </tr>
    <tr>
      <td>photos</td>
      <td>Photo[]</td>
      <td>Initial photos (optional).</td>
    </tr>
    <tr>
      <td>retries</td>
      <td>number</td>
      <td>
        <p>Retry attempts.</p>
        <p>Default value: <span class="font-mono">0</span></p>
      </td>
    </tr>
    <tr>
      <td>singleton</td>
      <td>boolean</td>
      <td>Use a single photo album component (masonry layout).</td>
    </tr>
    <tr>
      <td>fetchRootMargin</td>
      <td>string</td>
      <td>
        <p>Fetcher `IntersectionObserver` root margin setting.</p>
        <p>Default value: <span class="font-mono">800px</span></p>
      </td>
    </tr>
    <tr>
      <td>offscreenRootMargin</td>
      <td>string</td>
      <td>
        <p>Offscreen `IntersectionObserver` root margin setting.</p>
        <p>Default value: <span class="font-mono">2000px</span></p>
      </td>
    </tr>
    <tr>
      <td>error</td>
      <td>ReactNode</td>
      <td>Markup to display when an error occurred.</td>
    </tr>
    <tr>
      <td>loading</td>
      <td>ReactNode</td>
      <td>Markup to display while fetching additional photos.</td>
    </tr>
    <tr>
      <td>finished</td>
      <td>ReactNode</td>
      <td>Markup to display when no more photos are available.</td>
    </tr>
  </tbody>
</table>

### Rows Layout With Infinite Scroll

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import { UnstableInfiniteScroll as InfiniteScroll } from "react-photo-album/scroll";
import "react-photo-album/rows.css";

// ...

export default function Gallery() {
  return (
    <InfiniteScroll photos={initialPhotos} fetch={fetchPhotos}>
      <RowsPhotoAlbum
        photos={[]}
        spacing={20}
        componentsProps={{ container: { style: { marginBottom: 20 } } }}
      />
    </InfiniteScroll>
  );
}
```

### Masonry Layout With Infinite Scroll

```tsx
import { MasonryPhotoAlbum } from "react-photo-album";
import { UnstableInfiniteScroll as InfiniteScroll } from "react-photo-album/scroll";
import "react-photo-album/masonry.css";

// ...

export default function Gallery() {
  return (
    <InfiniteScroll singleton photos={initialPhotos} fetch={fetchPhotos}>
      <MasonryPhotoAlbum
        photos={[]}
        spacing={20}
        componentsProps={{ container: { style: { marginBottom: 20 } } }}
      />
    </InfiniteScroll>
  );
}
```

### Columns Layout With Infinite Scroll

Columns layout is not a good fit for the infinite scroll feature.

## Server-Side Rendering (SSR)

By default, [React Photo Album](/) produces an empty markup in SSR because the
actual container width is usually unknown during server-side rendering. This
default behavior causes content layout shift after hydration. As a workaround,
you can specify the `defaultContainerWidth` prop to enable photo album markup
rendering in SSR. However, that will likely result in the photo album layout
shift once the photo album re-calculates its layout on the client. With this
being said, there isn't a perfect solution for SSR, but there are several
options to choose from, depending on your use case.

### Default Container Width

To render photo album markup on the server, you can specify the
`defaultContainerWidth` value. It is a perfect SSR solution if your photo album
has a constant width in all viewports (e.g., an image picker in a fixed-size
sidebar). However, if the client-side photo album width doesn't match the
`defaultContainerWidth`, you are almost guaranteed to see a layout shift after
hydration.

```tsx
<RowsPhotoAlbum photos={photos} defaultContainerWidth={800} />
```

### Skeleton

Alternatively, you can provide a fallback skeleton in the `skeleton` prop that
will be rendered in SSR and swapped with the actual photo album markup after
hydration. This approach allows you to reserve a blank space on the page for the
photo album markup and avoid a flash of the below-the-fold content during
hydration. The downside of this approach is that images don't start downloading
until after hydration unless you manually add prefetch links to the document
`<head>`.

```tsx
<RowsPhotoAlbum
  photos={photos}
  skeleton={<div style={{ width: "100%", minHeight: 800 }} />}
/>
```

### Visibility Hidden

Another option is to render the photo album on the server with
`visibility: hidden`. This way, you can avoid a flash of the below-the-fold
content and allow the browser to start downloading images before hydration.

```tsx
<RowsPhotoAlbum
  photos={photos}
  defaultContainerWidth={800}
  componentsProps={(containerWidth) =>
    containerWidth === undefined
      ? {
          container: { style: { visibility: "hidden" } },
        }
      : {}
  }
/>
```

### SSR Component

The ultimate zero-CLS solution requires pre-rendering multiple layouts on the
server and displaying the correct one on the client using CSS `@container`
queries. [React Photo Album](/) provides an experimental `SSR` component
implementing this approach (the component is currently exported as
`UnstableSSR`). The downside of this approach is the overhead in SSR-generated
markup and the hydration of multiple photo album instances on the client (which
may be a reasonable compromise if zero CLS is a must-have requirement). You can
find a live demo in the [Zero CLS SSR](/examples/zero-cls-ssr) example.

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import { UnstableSSR as SSR } from "react-photo-album/ssr";
import "react-photo-album/rows.css";

import photos from "./photos";

export default function Gallery() {
  return (
    <SSR breakpoints={[300, 600, 900, 1200]}>
      <RowsPhotoAlbum photos={photos} />
    </SSR>
  );
}
```

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">breakpoints</span></td>
      <td>number[]</td>
      <td>Photo album layout breakpoints.</td>
    </tr>
    <tr>
      <td><span class="required">children</span></td>
      <td>ReactElement</td>
      <td>Photo album instance, which must be the only child.</td>
    </tr>
    <tr>
      <td>unstyled</td>
      <td>boolean</td>
      <td>
        If `true`, do not include the inline stylesheet. Use this option if you
        are using custom styling solution (e.g., Tailwind CSS) 
      </td>
    </tr>
    <tr>
      <td>classNames</td>
      <td>
        &#123;<br/>
        &nbsp;&nbsp;container?: string;<br/>
        &nbsp;&nbsp;breakpoints?: &#123;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;[key: number]: string;<br/> 
        &nbsp;&nbsp;&#125;<br/>
        &#125;
      </td>
      <td>Custom class names for the container and the breakpoint intervals.</td>
    </tr>
  </tbody>
</table>

Please share your feedback if you have successfully used this component in your
project or encountered any issues.

## Server Component

[React Photo Album](/) provides an experimental server component for rendering
static photo albums on the server with zero client-side JS bundle (the component
produces pure HTML markup with no client components). The component is currently
exported as `UnstableServerPhotoAlbum`. You can find a live demo in the
[Server Component](/examples/server) example.

```tsx
import { UnstableServerPhotoAlbum as ServerPhotoAlbum } from "react-photo-album/server";
```

<table class="docs">
  <tbody>
    <tr>
      <td><span class="required">layout</span></td>
      <td>"rows" | "columns" | "masonry"</td>
      <td>Layout type.</td>
    </tr>
    <tr>
      <td><span class="required">breakpoints</span></td>
      <td>number[]</td>
      <td>Photo album layout breakpoints.</td>
    </tr>
    <tr>
      <td>unstyled</td>
      <td>boolean</td>
      <td>If `true`, do not include the inline stylesheet.</td>
    </tr>
    <tr>
      <td>classNames</td>
      <td>
        &#123;<br/>
        &nbsp;&nbsp;container?: string;<br/>
        &nbsp;&nbsp;breakpoints?: &#123;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;[key: number]: string;<br/> 
        &nbsp;&nbsp;&#125;<br/>
        &#125;
      </td>
      <td>Custom class names for the container and the breakpoint intervals.</td>
    </tr>
  </tbody>
</table>

In addition to the props listed above, `ServerPhotoAlbum` supports all relevant
props corresponding to the selected layout type except the
`defaultContainerWidth`, `onClick` and `skeleton`.

### Server Component With Default Styling

```tsx
import { UnstableServerPhotoAlbum as ServerPhotoAlbum } from "react-photo-album/server";
import "react-photo-album/rows.css";

// ...

export default function Gallery() {
  return (
    <ServerPhotoAlbum
      layout="rows"
      photos={photos}
      breakpoints={[300, 600, 900]}
    />
  );
}
```

### Server Component With Tailwind CSS Styling

Here is an example of custom styling using
[@tailwindcss/container-queries](https://github.com/tailwindlabs/tailwindcss-container-queries).

```tsx
import { UnstableServerPhotoAlbum as ServerPhotoAlbum } from "react-photo-album/server";
import "react-photo-album/rows.css";

// ...

export default function Gallery() {
  return (
    <ServerPhotoAlbum
      unstyled
      layout="rows"
      photos={photos}
      breakpoints={[300, 600, 900]}
      classNames={{
        container: "@container",
        breakpoints: {
          150: "block @[300px]:hidden",
          300: "hidden @[300px]:block @[600px]:hidden",
          600: "hidden @[600px]:block @[900px]:hidden",
          900: "hidden @[900px]:block",
        },
      }}
    />
  );
}
```

Please share your feedback if you have successfully used this component in your
project or encountered any issues.

## Previous Versions

Are you looking for documentation for one of the previous versions?

- [react-photo-album v2](https://v2.react-photo-album.com/documentation)
- [react-photo-album v1](https://v1.react-photo-album.com/documentation)
