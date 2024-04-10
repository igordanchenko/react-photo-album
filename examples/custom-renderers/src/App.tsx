import { PhotoAlbum, RenderContainer, RenderPhoto, RenderRowContainer } from "react-photo-album";
import photos from "./photos";
import { useEffect, useRef, useState } from "react";

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

const renderPhoto: RenderPhoto = ({ layout, layoutOptions, imageProps: { alt, style, ...restImageProps } }) => {
  // The html element the intersection observer is looking for:
  const intersectionBox = useRef<HTMLDivElement>(null);
  // Indicates that the intersection box is inside the view and the content should be displayed:
  const [isIntersected, setIsIntersected] = useState(false);

  useEffect(() => {
    // Define the intersection obeserver:
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsIntersected(entry.isIntersecting);
      },
      // When should the intersector trigger?:
      { rootMargin: "50px" },
    );
    // Enabling lazy loading by start the observing:
    intersectionBox.current && observer.observe(intersectionBox.current);
    return () => {
      // Cleanup this component form observing:
      observer.disconnect();
    };
  }, []);

  return (
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
      <div
        ref={intersectionBox}
        style={{
          backgroundColor: "#EEE",
          width: layout.width,
          height: layout.height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isIntersected ? (
          <img alt={alt} style={{ ...style, width: "100%", padding: 0 }} {...restImageProps} />
        ) : (
          "LOADING"
        )}
      </div>
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
};

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
