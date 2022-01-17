import React from "react";
import { ContainerProps, PhotoAlbum, RenderContainer, RenderPhoto, RenderRowContainer } from "react-photo-album";
import photos from "./photos";

const CustomContainer: RenderContainer = React.forwardRef<HTMLDivElement, ContainerProps>((props, ref) => (
    <div
        style={{
            border: "2px solid #eee",
            borderRadius: "10px",
            padding: "20px",
        }}
    >
        <div ref={ref} {...props.containerProps}>
            {props.children}
        </div>
    </div>
));
CustomContainer.displayName = "CustomContainer";

const CustomRowContainer: RenderRowContainer = (props) => (
    <>
        <div {...props.rowContainerProps}>{props.children}</div>
        {props.rowIndex < props.rowsCount - 1 && (
            <div
                style={{
                    borderTop: "2px solid #eee",
                    marginBottom: "20px",
                }}
            />
        )}
    </>
);

const CustomPhoto: RenderPhoto = (props) => {
    const { layout, layoutOptions, imageProps } = props;
    const { alt, style, ...rest } = imageProps;
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
            <img alt={alt} style={{ ...style, width: "100%", padding: 0 }} {...rest} />
            <div
                style={{
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    overflow: "visible",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                }}
            >
                {Math.round(layout.width)} x {Math.round(layout.height)}
            </div>
        </div>
    );
};

const CustomRenderers = () => (
    <PhotoAlbum
        layout="rows"
        photos={photos}
        spacing={20}
        padding={20}
        targetRowHeight={200}
        renderContainer={CustomContainer}
        renderRowContainer={CustomRowContainer}
        renderPhoto={CustomPhoto}
    />
);

const App = () => <CustomRenderers />;

export default App;
