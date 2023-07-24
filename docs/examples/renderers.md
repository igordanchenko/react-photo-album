# Custom Renderers

Photo album photos and container elements can be customized via custom render functions.

## Custom Photo

```tsx
const renderPhoto: RenderPhoto = (props) => {
    // ...
};

<PhotoAlbum
    renderPhoto={renderPhoto}
    // ...
/>;
```

## Custom Container

```tsx
const renderContainer: RenderContainer = (props: RenderContainerProps) => {
    // ...
};

<PhotoAlbum
    renderContainer={renderContainer}
    // ...
/>;
```

## Custom Row Container

```tsx
const renderRowContainer: RenderRowContainer = (props) => {
    // ...
};

<PhotoAlbum
    renderRowContainer={renderRowContainer}
    // ...
/>;
```

## Custom Column Container

```tsx
const renderColumnContainer: RenderColumnContainer = (props) => {
    // ...
};

<PhotoAlbum
    renderColumnContainer={renderColumnContainer}
    // ...
/>;
```

## Live Demo

<CustomRenderers />

## CodeSandbox

<CodeSandboxLink suffix="custom-renderers" file="src/App.tsx" />

## Source Code

<GitHubLink suffix="custom-renderers" />
