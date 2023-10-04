# Documentation

[React Photo Album](/) allows you to build a responsive React photo gallery in
minutes. To get started, follow the [Installation](/#Installation) and
[Minimal Setup Example](/#MinimalSetupExample) guides, or feel free to explore
the collection of [examples](/examples) with live demos. The below documentation
covers React Photo Album API.

[React Photo Album](/) provides all components and types as named exports.
`PhotoAlbum` is exported as both default and named export.

Parameters marked with an asterisk (<span class="required" />) are required.

## PhotoAlbum

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
      <td><span class="required">layout</span></td>
      <td>'columns' | 'rows' | 'masonry'</td>
      <td>Photo album layout type.</td>
    </tr>
    <tr>
      <td>columns</td>
      <td>ResponsiveParameter</td>
      <td>
        <p>
          A number of columns in the columns or masonry layout.
          See [ResponsiveParameter](#ResponsiveParameter) for details.
        </p>
        <p>Default responsive value:</p>
        <ul>
          <li>5, when container width >= 1200</li>
          <li>4, when container width >= 600 and &lt; 1200</li>
          <li>3, when container width >= 300 and &lt; 600</li>
          <li>2, when container width &lt; 300</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>spacing</td>
      <td>ResponsiveParameter</td>
      <td>
        <p>
          Spacing between images (similar to CSS grid gap).
          See [ResponsiveParameter](#ResponsiveParameter) for details.
        </p>
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
      <td>ResponsiveParameter</td>
      <td>
        <p>
          Padding around each image in the photo album.
          See [ResponsiveParameter](#ResponsiveParameter) for details.
        </p>
        <p>Default value: <span class="font-mono">0</span></p>
      </td>
    </tr>
    <tr>
      <td>targetRowHeight</td>
      <td>ResponsiveParameter</td>
      <td>
        <p>
          Target row height in the rows layout.
          See [ResponsiveParameter](#ResponsiveParameter) for details.
        </p>
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
      <td>ResponsiveParameter&#8203;&lt;RowConstraints&gt;</td>
      <td>
        <p>Additional row constraints in the `rows` layout.</p>
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
    <tr>
      <td>sizes</td>
      <td>ResponsiveSizes</td>
      <td>
        <p>
          Photo album container width at various viewport sizes. 
          See [ResponsiveSizes](#ResponsiveSizes) for details.
        </p>
        <p>Default value: <span class="font-mono">100vw</span></p>
      </td>
    </tr>
    <tr>
      <td>onClick</td>
      <td>ClickHandler</td>
      <td>
          Photo click callback function.
          See [ClickHandler](#ClickHandler) for details.
      </td>
    </tr>
    <tr>
      <td>breakpoints</td>
      <td>number[]</td>
      <td>
        Responsive breakpoints. 
        See [ResponsiveBreakpoints](#ResponsiveBreakpoints) for details.
      </td>
    </tr>
    <tr>
      <td>defaultContainerWidth</td>
      <td>number</td>
      <td>Default container width in SSR.</td>
    </tr>
    <tr>
      <td>componentsProps</td>
      <td>ComponentsPropsParameter</td>
      <td>
        Additional HTML attributes to be passed to the rendered elements.
        See [ComponentsPropsParameter](#ComponentsPropsParameter) for details.
      </td>
    </tr>
    <tr>
      <td>renderPhoto</td>
      <td>RenderPhoto</td>
      <td>
        Custom photo rendering function.
        See [RenderPhoto](#RenderPhoto) for details.
      </td>
    </tr>
    <tr>
      <td>renderContainer</td>
      <td>RenderContainer</td>
      <td>
        Custom container rendering function. 
        See [RenderContainer](#RenderContainer) for details.
      </td>
    </tr>
    <tr>
      <td>renderRowContainer</td>
      <td>RenderRowContainer</td>
      <td>
        Custom row container rendering function. 
        See [RenderRowContainer](#RenderRowContainer) for details.
      </td>
    </tr>
    <tr>
      <td>renderColumnContainer</td>
      <td>RenderColumnContainer</td>
      <td>
        Custom column container rendering function. 
        See [RenderColumnContainer](#RenderColumnContainer) for details.
      </td>
    </tr>
  </tbody>
</table>

## Photo

<table class="docs">
  <tbody>
    <tr>
      <td>key</td>
      <td>string</td>
      <td>Optional `key` attribute.</td>
    </tr>
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
      <td>alt</td>
      <td>string</td>
      <td>Optional image `alt` attribute.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>Optional image `title` attribute.</td>
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
    <tr>
      <td>images</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;src:&nbsp;string;<br />
        &nbsp;&nbsp;width:&nbsp;number;<br />
        &nbsp;&nbsp;height:&nbsp;number;<br />
        &#125;[]
      </td>
      <td>Deprecated. Use `srcSet` instead.</td>
    </tr>
  </tbody>
</table>

You can pass additional photo attributes and access them inside the
`renderPhoto` function.

```tsx
<PhotoAlbum
  layout="rows"
  photos={[
    {
      src: "/images/image1.jpg",
      width: 800,
      height: 600,
      href: "https://react-photo-album.com/",
    },
  ]}
  renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    <a
      href={photo.href}
      style={wrapperStyle}
      target="_blank"
      rel="noreferrer noopener"
    >
      {renderDefaultPhoto({ wrapped: true })}
    </a>
  )}
/>
```

## ClickHandler

`PhotoAlbum` accepts a click callback function via the `onClick` parameter.

### ClickHandler Props

<table class="docs">
  <tbody>
    <tr>
      <td>index</td>
      <td>number</td>
      <td>Photo index.</td>
    </tr>
    <tr>
      <td>photo</td>
      <td>Photo</td>
      <td>Original photo object.</td>
    </tr>
    <tr>
      <td>event</td>
      <td>React.MouseEvent</td>
      <td>Corresponding mouse event.</td>
    </tr>
  </tbody>
</table>

### ClickHandler Usage Example

```tsx
<PhotoAlbum
  layout="rows"
  photos={photos}
  onClick={({ index }) => {
    openLightbox(index);
  }}
/>
```

## ResponsiveParameter

`PhotoAlbum` accepts various props via `ResponsiveParameter` type.

Responsive parameters can be provided either as a hard-coded `number`

```tsx
<PhotoAlbum columns={3} />
```

or as a function of container width

```tsx
<PhotoAlbum
  columns={(containerWidth) => {
    if (containerWidth < 400) return 2;
    if (containerWidth < 800) return 3;
    return 4;
  }}
/>
```

## ComponentsPropsParameter

You can pass additional HTML attributes to the rendered elements via the
`componentsProps` parameter. `componentsProps` prop can be defined either as an
object or as a function of an optional container width.

<table class="docs">
  <tbody>
    <tr>
      <td>containerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Additional HTML attributes to be passed to the outer container `div` element.
      </td>
    </tr>
    <tr>
      <td>rowContainerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Additional HTML attributes to be passed to the row container `div` element.
      </td>
    </tr>
    <tr>
      <td>columnContainerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Additional HTML attributes to be passed to the column container `div` element.
      </td>
    </tr>
    <tr>
      <td>imageProps</td>
      <td>ImgHTMLAttributes&#8203;&lt;HTMLImageElement&gt;</td>
      <td>
        <p>Additional HTML attributes to be passed to the photo `img` element.</p>
        <p>
          Default: <span class="font-mono">&#123; loading: "lazy", decoding: "async"&#125;</span>
        </p>
      </td>
    </tr>
  </tbody>
</table>

### ComponentsProps Usage Example

```tsx
<PhotoAlbum
  layout="rows"
  photos={photos}
  componentsProps={(containerWidth) => ({
    imageProps: { loading: (containerWidth || 0) > 600 ? "eager" : "lazy" },
  })}
/>
```

## LayoutOptions

`LayoutOptions` object represents photo album configuration and can be used in
custom render functions to access photo album parameters.

<table class="docs">
  <tbody>
    <tr>
      <td>layout</td>
      <td>'columns' | 'rows' | 'masonry'</td>
      <td>Photo album layout type.</td>
    </tr>
    <tr>
      <td>spacing</td>
      <td>number</td>
      <td>Layout spacing (gaps between photos).</td>
    </tr>
    <tr>
      <td>padding</td>
      <td>number</td>
      <td>Padding around each photo.</td>
    </tr>
    <tr>
      <td>containerWidth</td>
      <td>number</td>
      <td>
        Current photo album container width. Defaults to `defaultContainerWidth`
        when rendered server-side.
      </td>
    </tr>
    <tr>
      <td>onClick</td>
      <td>ClickHandler | undefined</td>
      <td>Photo click handler. See [ClickHandler](#ClickHandler) for details.</td>
    </tr>
    <tr>
      <td>sizes</td>
      <td>ResponsiveSizes | undefined</td>
      <td>
        `PhotoAlbum` size at various viewport sizes.
        See [ResponsiveSizes](#ResponsiveSizes) for details.
      </td>
    </tr>
    <tr>
      <td>columns</td>
      <td>number | undefined</td>
      <td>Number of columns in `columns` or `masonry` layout.</td>
    </tr>
    <tr>
      <td>targetRowHeight</td>
      <td>number | undefined</td>
      <td>Target row height in `rows` layout.</td>
    </tr>
    <tr>
      <td>rowConstraints</td>
      <td>RowConstraints | undefined</td>
      <td>
        Additional row constraints. 
        See [RowConstraints](#RowConstraints) for details.
      </td>
    </tr>
  </tbody>
</table>

## RenderPhoto

`PhotoAlbum` photos can be customized via the `renderPhoto` render function.

### RenderPhoto Props

<table class="docs">
  <tbody>
    <tr>
      <td>photo</td>
      <td>Photo</td>
      <td>Photo object. See [Photo](#Photo) for details.</td>
    </tr>
    <tr>
      <td>layout</td>
      <td>PhotoLayout</td>
      <td>
        <p>
          Computed photo layout. Please note that `width` and `height` are expressed 
          in `content-box` notation.
        </p>
        <ul>
          <li>`width` - photo width</li>
          <li>`height` - photo height</li>
          <li>`index` - photo index in the original `photos` array</li>
          <li>`photoIndex` - photo index in a given row or column</li>
          <li>`photosCount` - total number of photos in a given row or column</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>layoutOptions</td>
      <td>LayoutOptions</td>
      <td>
        `PhotoAlbum` layout properties.
        See [LayoutOptions](#LayoutOptions) for details.
      </td>
    </tr>
    <tr>
      <td>imageProps</td>
      <td>ImgHTMLAttributes&#8203;&lt;HTMLImageElement&gt;</td>
      <td>
        Pre-populated `img` element attributes (`display`, `box-sizing`, `width`,
        `height`, `aspect-ratio`, `padding`, `margin-bottom` and `cursor`).
      </td>
    </tr>
    <tr>
      <td>renderDefaultPhoto</td>
      <td>(options?: &#123; wrapped?: boolean &#125;) =&gt; ReactNode</td>
      <td>
        A callback to render the default photo implementation. If `wrapped` is `true`,
        the image is styled with `width` and `height` set to 100%. Use this option
        when rendering image wrapper styled with `wrapperStyle`.
      </td>
    </tr>
    <tr>
      <td>wrapperStyle</td>
      <td>CSSProperties</td>
      <td>
        CSS styles to properly size image wrapper (i.e. `<div/>` or `<a/>` wrapper)
      </td>
    </tr>
  </tbody>
</table>

### RenderPhoto Usage Example

```tsx
<PhotoAlbum
  layout="rows"
  photos={photos}
  renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    <div style={{ position: "relative", ...wrapperStyle }}>
      {renderDefaultPhoto({ wrapped: true })}
      {photo.title && (
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            backgroundColor: "rgba(255 255 255 / .6)",
            inset: "auto 0 0 0",
            padding: 8,
          }}
        >
          {photo.title}
        </div>
      )}
    </div>
  )}
/>
```

## RenderContainer

`PhotoAlbum` container can be customized via the `renderContainer` render
function. Please note that you must pass the `containerRef` ref to your
container element (see [example](/examples/renderers#CustomContainer)).

### RenderContainer Props

<table class="docs">
  <tbody>
    <tr>
      <td>layout</td>
      <td>'columns' | 'rows' | 'masonry'</td>
      <td>Photo album layout type.</td>
    </tr>
    <tr>
      <td>containerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Pre-populated default container attributes (`display`, `flex-wrap`, 
        `flex-direction` and `justify-content`).
      </td>
    </tr>
    <tr>
      <td>containerRef</td>
      <td>RefCallback&#8203;&lt;HTMLDivElement&gt;</td>
      <td>Custom `<div/>` container ref callback.</td>
    </tr>
  </tbody>
</table>

## RenderRowContainer

`PhotoAlbum` row containers can be customized via the `renderRowContainer`
render function.

### RenderRowContainer Props

<table class="docs">
  <tbody>
    <tr>
      <td>layoutOptions</td>
      <td>RowsLayoutOptions</td>
      <td>
        `PhotoAlbum` layout properties.
        See [LayoutOptions](#LayoutOptions) for details.
      </td>
    </tr>
    <tr>
      <td>rowIndex</td>
      <td>number</td>
      <td>Row number.</td>
    </tr>
    <tr>
      <td>rowsCount</td>
      <td>number</td>
      <td>Total number of rows.</td>
    </tr>
    <tr>
      <td>rowContainerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Pre-populated default row container attributes (`display`, `flex-wrap`, 
        `flex-direction`, `justify-content`, `align-items` and `margin-bottom`).
      </td>
    </tr>
  </tbody>
</table>

## RenderColumnContainer

`PhotoAlbum` column containers can be customized via the `renderColumnContainer`
render function.

### RenderColumnContainer Props

<table class="docs">
  <tbody>
    <tr>
      <td>layoutOptions</td>
      <td>ColumnsLayoutOptions</td>
      <td>
        `PhotoAlbum` layout properties.
        See [LayoutOptions](#LayoutOptions) for details.
      </td>
    </tr>
    <tr>
      <td>columnIndex</td>
      <td>number</td>
      <td>Column index.</td>
    </tr>
    <tr>
      <td>columnsCount</td>
      <td>number</td>
      <td>Total number of columns.</td>
    </tr>
    <tr>
      <td>columnsGaps</td>
      <td>number[] | undefined</td>
      <td>
        Sum of spacings and paddings in each column. `columnsGaps` property 
        is not provided in the masonry layout.
      </td>
    </tr>
    <tr>
      <td>columnsRatios</td>
      <td>number[] | undefined</td>
      <td>
        Width adjustment ratios of each column. `columnsRatios` property is 
        not provided in the masonry layout.
      </td>
    </tr>
    <tr>
      <td>columnContainerProps</td>
      <td>HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
      <td>
        Pre-populated default column container attributes (`display`, `flex-wrap`,
        `flex-direction`, `justify-content`, `align-items` and `width`).
      </td>
    </tr>
  </tbody>
</table>

## ResponsiveBreakpoints

By default, `PhotoAlbum` re-calculates its layout every time its container width
changes. For example, the layout may get re-calculated dozens of times during a
simple browser window resize. If this behavior is undesired, you can avoid it by
providing responsive `breakpoints` (e.g., <span class="font-mono">[300, 600,
1200]</span>). When the breakpoints parameter is defined, `PhotoAlbum`
calculates the layout only once per breakpoint interval using the interval's
lower boundary as the container width, and the layout is scaled automatically
via CSS. On the interval between 0 and the lowest breakpoint, `PhotoAlbum` uses
1/2 of the lowest breakpoint as the container width. Please also note that it
makes sense to use the breakpoints parameter only in conjunction with CSS-based
photo props (`imageProps.style.width` and `imageProps.style.width`) rather than
the exact photo dimensions expressed in pixels (`layout.width` and
`layout.height`).

```tsx
<PhotoAlbum
  breakpoints={[300, 600, 1200]}
  // ...
/>
```

## ResponsiveSizes

`ResponsiveSizes` attribute is only applicable when you use the `srcset` feature
and provide resolution-switching image files in the photo `srcSet` attribute. By
default, PhotoAlbum assumes <span class="font-mono">100vw</span> as its
on-screen horizontal dimension. To improve `sizes` attribute accuracy on
individual images, you can describe the photo album dimensions under various
media conditions via the `sizes` attribute.

For example, this website uses the following `sizes` attribute to account for
content container padding and the left-hand side navigation menu at various
breakpoints:

```tsx
<PhotoAlbum
  sizes={{
    size: "992px",
    sizes: [
      { viewport: "(max-width: 767px)", size: "calc(100vw - 32px)" },
      { viewport: "(max-width: 1279px)", size: "calc(100vw - 288px)" },
    ],
  }}
  // ...
/>
```

## Previous Versions

Are you looking for documentation for one of the previous versions?

- [react-photo-album v1.x](https://v1.react-photo-album.com/documentation)
