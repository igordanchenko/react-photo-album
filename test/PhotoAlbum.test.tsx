import * as React from "react";
import renderer from "react-test-renderer";
import { act, render, screen } from "@testing-library/react";

import { LayoutType, PhotoAlbum, PhotoAlbumProps } from "../src";
import photos from "./photos";

const whenAskedToRender = (Component: JSX.Element) => {
    expect(renderer.create(Component).toJSON()).toMatchSnapshot();
};

const withRowsTestCase = (spacing: number, targetRowHeight: number, defaultContainerWidth: number) => ({
    layout: "rows" as LayoutType,
    spacing,
    targetRowHeight,
    defaultContainerWidth,
});

const withColumnsTestCase = (spacing: number, columns: number, defaultContainerWidth: number) => ({
    layout: "columns" as LayoutType,
    spacing,
    columns,
    defaultContainerWidth,
});

const withMasonryTestCase = (spacing: number, columns: number, defaultContainerWidth: number) => ({
    layout: "masonry" as LayoutType,
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

    it("supports padding", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} padding={10} />);
    });

    it("renders columns layout correctly when there isn't enough photos", () => {
        whenAskedToRender(<PhotoAlbum layout={"columns"} photos={photos.slice(0, 3)} columns={5} />);
    });

    it("renders correctly with invalid defaultContainerWidth", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} defaultContainerWidth={-1} />);
    });

    it("supports deterministic tiebreaker", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={Array.from({ length: 7 }).map((_, index) => ({ key: `${index}`, ...photos[0] }))}
                spacing={10}
                padding={5}
                targetRowHeight={150}
                defaultContainerWidth={513}
            />
        );
    });

    it("supports srcset and sizes", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos.map((photo) => ({
                    ...photo,
                    images: [
                        { src: photo.src, width: Math.round(photo.width / 2), height: Math.round(photo.height / 2) },
                    ],
                }))}
            />
        );
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
                // eslint-disable-next-line react/display-name
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

    it("doesn't crash when invoked without required parameters", () => {
        whenAskedToRender(React.createElement(PhotoAlbum));
        whenAskedToRender(React.createElement(PhotoAlbum, { layout: "columns" } as PhotoAlbumProps));
        whenAskedToRender(React.createElement(PhotoAlbum, { photos: [] } as unknown as PhotoAlbumProps));
    });

    it("doesn't crash when invoked with invalid required parameters", () => {
        whenAskedToRender(React.createElement(PhotoAlbum, { layout: "unknown" } as unknown as PhotoAlbumProps));
        whenAskedToRender(React.createElement(PhotoAlbum, { photos: 0 } as unknown as PhotoAlbumProps));
        whenAskedToRender(React.createElement(PhotoAlbum, { photos: null } as unknown as PhotoAlbumProps));
    });

    it("supports responsive parameters", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                spacing={() => 10}
                padding={() => 5}
                targetRowHeight={() => 100}
            />
        );

        whenAskedToRender(
            <PhotoAlbum layout={"columns"} photos={photos} columns={() => 3} spacing={() => 10} padding={() => 5} />
        );
    });

    it("supports click handler", () => {
        const testPhotos = photos.map((photo, index) => ({ alt: `photo-${index}`, ...photo }));
        const onClick = jest.fn();

        render(<PhotoAlbum layout={"rows"} photos={testPhotos} onClick={onClick} />);

        screen.getByAltText("photo-0").click();

        expect(onClick.mock.calls.length).toBe(1);
        expect(onClick.mock.calls[0][1]).toBe(testPhotos[0]);
    });

    it("supports sizes attribute", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} sizes={{ size: "100vw" }} />);

        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                sizes={{ size: "50vw", sizes: [{ viewport: "(max-width: 600px)", size: "100vw" }] }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                sizes={{ size: "calc(50vw - 50px)", sizes: [{ viewport: "(max-width: 600px)", size: "100vw" }] }}
            />
        );
    });

    it("supports global ResizeObserver", () => {
        const resizeObserverRef = global.ResizeObserver;
        try {
            const observeMock = jest.fn();
            const unobserveMock = jest.fn();
            const disconnectMock = jest.fn();

            global.ResizeObserver = jest.fn().mockImplementation(() => ({
                observe: observeMock,
                unobserve: unobserveMock,
                disconnect: disconnectMock,
            }));

            render(<PhotoAlbum layout={"rows"} photos={photos} />).unmount();

            expect(observeMock).toHaveBeenCalledTimes(1);
            expect(unobserveMock).toHaveBeenCalledTimes(0);
            expect(disconnectMock).toHaveBeenCalledTimes(1);
        } finally {
            global.ResizeObserver = resizeObserverRef;
        }
    });

    it("supports custom ResizeObserver and observes container ref changes", () => {
        const resizeObserverMock = {
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const resizeObserverProvider = jest.fn((_) => resizeObserverMock);

        const { rerender, unmount } = render(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                // eslint-disable-next-line react/display-name
                renderContainer={React.forwardRef((props, ref) => (
                    <div ref={ref} key={1}>
                        {props.children}
                    </div>
                ))}
                resizeObserverProvider={resizeObserverProvider}
            />
        );

        expect(resizeObserverMock.observe.mock.calls.length).toBe(1);

        act(() => {
            resizeObserverProvider.mock.calls[0][0]();
        });

        rerender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                // eslint-disable-next-line react/display-name
                renderContainer={React.forwardRef((props, ref) => (
                    <div ref={ref} key={2}>
                        {props.children}
                    </div>
                ))}
                resizeObserverProvider={resizeObserverProvider}
            />
        );

        unmount();

        expect(resizeObserverMock.observe.mock.calls.length).toBe(2);
        expect(resizeObserverMock.disconnect.mock.calls.length).toBe(1);
    });

    it("supports instrumentation", () => {
        const instrumentation = {
            onStartLayoutComputation: jest.fn(),
            onFinishLayoutComputation: jest.fn(),
        };

        render(<PhotoAlbum layout={"rows"} photos={photos} instrumentation={instrumentation} />);
        render(<PhotoAlbum layout={"columns"} photos={photos} instrumentation={instrumentation} />);
        render(<PhotoAlbum layout={"masonry"} photos={photos} instrumentation={instrumentation} />);

        expect(instrumentation.onStartLayoutComputation.mock.calls.length).toBe(6);
        expect(instrumentation.onFinishLayoutComputation.mock.calls.length).toBe(6);
    });
});
