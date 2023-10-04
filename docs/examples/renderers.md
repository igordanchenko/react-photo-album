# Custom Renderers

Photo album photos and container elements can be customized via custom render
functions.

## Custom Photo

You can use the following render function as a starting point:

```tsx
<PhotoAlbum
  renderPhoto={({ imageProps: { src, alt, style, ...restImageProps } }) => (
    <img src={src} alt={alt} style={style} {...restImageProps} />
  )}
  // ...
/>
```

You can use `wrapperStyle` and `renderDefaultPhoto` helpers to wrap images with
`<div>`, `<span>` or `<a>` tags:

```tsx
<PhotoAlbum
  renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    <a href={photo.href} style={wrapperStyle}>
      {renderDefaultPhoto({ wrapped: true })}
    </a>
  )}
  // ...
/>
```

## Custom Container

You can use the following render function as a starting point:

```tsx
<PhotoAlbum
  renderContainer={({ containerRef, containerProps, children }) => (
    <div ref={containerRef} {...containerProps}>
      {children}
    </div>
  )}
  // ...
/>
```

## Custom Row Container

You can use the following render function as a starting point:

```tsx
<PhotoAlbum
  renderRowContainer={({ rowContainerProps, children }) => (
    <div {...rowContainerProps}>{children}</div>
  )}
  // ...
/>
```

## Custom Column Container

You can use the following render function as a starting point:

```tsx
<PhotoAlbum
  renderColumnContainer={({ columnContainerProps, children }) => (
    <div {...columnContainerProps}>{children}</div>
  )}
  // ...
/>
```

## Live Demo

<CustomRenderers />

## CodeSandbox

<CodeSandboxLink suffix="custom-renderers" file="src/App.tsx" />

## Source Code

<GitHubLink suffix="custom-renderers" />
