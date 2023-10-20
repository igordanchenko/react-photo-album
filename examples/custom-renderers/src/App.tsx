import { PhotoAlbum, RenderContainer, RenderPhoto, RenderRowContainer } from "react-photo-album";
import photos from "./photos";

const renderContainer: RenderContainer = ({ containerProps, children, containerRef }) => (
  <div
    style={{
      border: "2px solid #eee",
      borderRadius: "10px",
      padding: "20px",
    }}
  >
    <div ref={containerRef} {...containerProps}>
      {children}
    </div>
  </div>
);

const renderRowContainer: RenderRowContainer = ({ rowContainerProps, rowIndex, rowsCount, children }) => (
  <>
    <div {...rowContainerProps}>{children}</div>
    {rowIndex < rowsCount - 1 && (
      <div
        style={{
          borderTop: "2px solid #eee",
          marginBottom: "20px",
        }}
      />
    )}
  </>
);

const renderPhoto: RenderPhoto = ({ layout, layoutOptions, imageProps: { alt, style, ...restImageProps } }) => (
  <div
    style={{
      border: "2px solid #eee",
      borderRadius: "4px",
      boxSizing: "content-box",
      alignItems: "center",
      width: style?.width,
      padding: `${layoutOptions.padding - 2}px`,
      paddingBottom: 0,
    }}
  >
    <img alt={alt} style={{ ...style, width: "100%", padding: 0 }} {...restImageProps} />
    <div
      style={{
        paddingTop: "8px",
        paddingBottom: "8px",
        overflow: "visible",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}
    >
      {Math.round(layout.width) + " x " + Math.round(layout.height)}
    </div>
  </div>
);

export default function App() {
  return (
    <PhotoAlbum
      layout="rows"
      photos={photos}
      spacing={20}
      padding={20}
      targetRowHeight={200}
      renderContainer={renderContainer}
      renderRowContainer={renderRowContainer}
      renderPhoto={renderPhoto}
    />
  );
}
