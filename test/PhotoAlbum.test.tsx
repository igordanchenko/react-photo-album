import * as React from "react";
import renderer from "react-test-renderer";

import PhotoAlbum from "../src";
import Layout from "../src/Layout";
import photos from "./photos";

const whenAskedToRender = (Component: JSX.Element) => {
    expect(renderer.create(Component).toJSON()).toMatchSnapshot();
};

const withRowsTestCase = (spacing: number, targetRowHeight: number, defaultContainerWidth: number) => ({
    layout: Layout.Rows,
    spacing,
    targetRowHeight,
    defaultContainerWidth,
});

const withColumnsTestCase = (spacing: number, columns: number, defaultContainerWidth: number) => ({
    layout: Layout.Columns,
    spacing,
    columns,
    defaultContainerWidth,
});

const withMasonryTestCase = (spacing: number, columns: number, defaultContainerWidth: number) => ({
    layout: Layout.Masonry,
    spacing,
    columns,
    defaultContainerWidth,
});

describe("PhotoAlbum", () => {
    it("renders rows layout without crashing", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} />);
    });

    it("renders columns layout without crashing", () => {
        whenAskedToRender(<PhotoAlbum layout={"columns"} photos={photos} />);
    });

    it("renders masonry layout without crashing", () => {
        whenAskedToRender(<PhotoAlbum layout={"masonry"} photos={photos} />);
    });

    it("renders columns layout with many columns without crashing", () => {
        whenAskedToRender(<PhotoAlbum layout={"columns"} photos={photos} columns={20} />);
    });

    it("renders masonry layout with many columns without crashing", () => {
        whenAskedToRender(<PhotoAlbum layout={"masonry"} photos={photos} columns={20} />);
    });

    [
        withRowsTestCase(3, 40, 290),
        withRowsTestCase(4, 60, 380),
        withRowsTestCase(6, 85, 600),
        withRowsTestCase(10, 150, 600),
        withRowsTestCase(10, 200, 800),
        withRowsTestCase(20, 300, 800),
        withRowsTestCase(10, 100, 1500),
        withRowsTestCase(20, 500, 1500),
        withRowsTestCase(10, 200, 2000),
        withRowsTestCase(20, 600, 2000),
    ].forEach(({ layout, spacing, targetRowHeight, defaultContainerWidth }) => {
        it(`renders ${layout} layout with spacing=${spacing} targetRowHeight=${targetRowHeight} defaultContainerWidth=${defaultContainerWidth} as expected`, () => {
            whenAskedToRender(
                <PhotoAlbum
                    photos={photos}
                    layout={layout}
                    spacing={spacing}
                    targetRowHeight={targetRowHeight}
                    defaultContainerWidth={defaultContainerWidth}
                />
            );
        });
    });

    [
        withColumnsTestCase(2, 2, 290),
        withColumnsTestCase(5, 3, 380),
        withColumnsTestCase(10, 3, 600),
        withColumnsTestCase(5, 4, 600),
        withColumnsTestCase(20, 3, 800),
        withColumnsTestCase(10, 5, 800),
        withColumnsTestCase(20, 4, 1500),
        withColumnsTestCase(10, 6, 1500),
        withColumnsTestCase(20, 4, 2000),
        withColumnsTestCase(10, 7, 2000),
    ].forEach(({ layout, spacing, columns, defaultContainerWidth }) => {
        it(`renders ${layout} layout with spacing=${spacing} columns=${columns} defaultContainerWidth=${defaultContainerWidth} as expected`, () => {
            whenAskedToRender(
                <PhotoAlbum
                    photos={photos}
                    layout={layout}
                    spacing={spacing}
                    columns={columns}
                    defaultContainerWidth={defaultContainerWidth}
                />
            );
        });
    });

    [
        withMasonryTestCase(2, 2, 290),
        withMasonryTestCase(5, 3, 380),
        withMasonryTestCase(10, 3, 600),
        withMasonryTestCase(5, 4, 600),
        withMasonryTestCase(20, 3, 800),
        withMasonryTestCase(10, 5, 800),
        withMasonryTestCase(20, 4, 1500),
        withMasonryTestCase(10, 6, 1500),
        withMasonryTestCase(20, 4, 2000),
        withMasonryTestCase(10, 7, 2000),
    ].forEach(({ layout, spacing, columns, defaultContainerWidth }) => {
        it(`renders ${layout} layout with spacing=${spacing} columns=${columns} defaultContainerWidth=${defaultContainerWidth} as expected`, () => {
            whenAskedToRender(
                <PhotoAlbum
                    photos={photos}
                    layout={layout}
                    spacing={spacing}
                    columns={columns}
                    defaultContainerWidth={defaultContainerWidth}
                />
            );
        });
    });

    it("allows rendering custom container", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                renderContainer={React.forwardRef(({ children }, ref) => (
                    <div ref={ref} className="custom-class">
                        {children}
                    </div>
                ))}
            />
        );
    });

    it("allows rendering custom row container", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                renderRowContainer={({ children }) => <div className={"custom-row-class"}>{children}</div>}
            />
        );
    });

    it("allows rendering custom column container", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"columns"}
                photos={photos}
                renderColumnContainer={({ children }) => <div className={"custom-column-class"}>{children}</div>}
            />
        );
    });

    it("doesn't crash when asked to render impossible rows layout", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} padding={100} defaultContainerWidth={50} />);
    });

    it("doesn't crash when asked to render impossible columns layout", () => {
        whenAskedToRender(
            <PhotoAlbum layout={"columns"} photos={photos} columns={3} padding={100} defaultContainerWidth={50} />
        );
    });

    it("doesn't crash when asked to render impossible masonry layout", () => {
        whenAskedToRender(
            <PhotoAlbum layout={"masonry"} photos={photos} columns={3} padding={100} defaultContainerWidth={50} />
        );
    });

    it("uses src when key is not supplied", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos.map((photo) => ({ src: photo.src, width: photo.width, height: photo.height }))}
            />
        );
    });
});
