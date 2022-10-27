import * as React from "react";
import renderer from "react-test-renderer";
import { act, render, screen } from "@testing-library/react";

import {
    ClickHandler,
    LayoutType,
    Photo,
    PhotoAlbum,
    PhotoAlbumProps,
    RenderContainerProps,
    RenderPhoto,
} from "../src";
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

    it("supports minimum number of elements in a row", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} rowConstraints={{ minPhotos: 3 }} />);
    });

    it("supports maximum number of elements in a row", () => {
        whenAskedToRender(<PhotoAlbum layout={"rows"} photos={photos} rowConstraints={{ maxPhotos: 4 }} />);
    });

    it("renders columns layout correctly when there isn't enough photos", () => {
        whenAskedToRender(<PhotoAlbum layout={"columns"} photos={photos.slice(0, 3)} columns={5} />);
    });

    it("supports minimum number of columns parameter", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"masonry"}
                photos={photos.slice(0, 2)}
                columns={4}
                columnConstraints={{ minColumns: 4 }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum
                layout={"columns"}
                photos={photos.slice(0, 2)}
                columns={4}
                columnConstraints={{ minColumns: 4 }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum layout={"masonry"} photos={[]} columns={4} columnConstraints={{ minColumns: 4 }} />
        );

        whenAskedToRender(
            <PhotoAlbum layout={"columns"} photos={[]} columns={4} columnConstraints={{ minColumns: 4 }} />
        );
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
                renderContainer={({ children, containerRef }: RenderContainerProps) => (
                    <div ref={containerRef} className="custom-class">
                        {children}
                    </div>
                )}
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

    it("supports custom photo attributes", () => {
        interface CustomPhoto extends Photo {
            customAttribute?: string | number;
        }

        const customPhotos: CustomPhoto[] = photos.map((photo, index) => ({ ...photo, customAttribute: index }));

        const renderCustomPhoto: RenderPhoto<CustomPhoto> = ({
            photo,
            imageProps: { src, alt, ...restImageProps },
        }) => <img src={src} alt={alt} data-custom-attribute={photo.customAttribute} {...restImageProps} />;

        const clickHandler: ClickHandler<CustomPhoto> = (event, photo, index) => {
            // this check doesn't actually get called, but it's here to type check the click handler
            expect(photo.customAttribute).toBe(index);
        };

        whenAskedToRender(
            <PhotoAlbum layout={"rows"} photos={customPhotos} renderPhoto={renderCustomPhoto} onClick={clickHandler} />
        );
    });

    it("supports custom photo attributes with inline render function", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos.map((photo, index) => ({ ...photo, customAttribute: index }))}
                renderPhoto={({ photo, imageProps: { src, alt, ...restImageProps } }) => (
                    <img src={src} alt={alt} data-custom-attribute={photo.customAttribute} {...restImageProps} />
                )}
                onClick={(event, photo, index) => {
                    // this check doesn't actually get called, but it's here to type check the click handler
                    expect(photo.customAttribute).toBe(index);
                }}
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
        whenAskedToRender(
            React.createElement(PhotoAlbum, {
                layout: "unknown",
                photos: [],
            } as unknown as PhotoAlbumProps)
        );
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
                rowConstraints={() => ({
                    minPhotos: 1,
                    maxPhotos: 2,
                })}
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

    it("supports breakpoints attribute", () => {
        render(<PhotoAlbum layout={"rows"} photos={photos} breakpoints={[300, 600, 1200]} />).unmount();
    });

    it("supports inline breakpoints", () => {
        const onStartLayoutComputation = jest.fn();
        const instrumentation = { onStartLayoutComputation };

        const resizeObserverProvider = jest.fn(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));

        const { rerender, unmount } = render(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                breakpoints={[300, 600, 1200]}
                resizeObserverProvider={resizeObserverProvider}
                instrumentation={instrumentation}
            />
        );

        rerender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                breakpoints={[300, 600, 1200]}
                resizeObserverProvider={resizeObserverProvider}
                instrumentation={instrumentation}
            />
        );

        expect(resizeObserverProvider).toHaveBeenCalledTimes(1);
        expect(onStartLayoutComputation).toHaveBeenCalledTimes(3); // 2 + 1 initial render

        unmount();
    });

    it("supports inline resizeObserverProvider", () => {
        const resizeObserver = {
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        };

        const { rerender, unmount } = render(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                breakpoints={[300, 600, 1200]}
                resizeObserverProvider={() => resizeObserver}
            />
        );

        rerender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                breakpoints={[300, 600, 1200]}
                resizeObserverProvider={() => resizeObserver}
            />
        );

        expect(resizeObserver.observe).toHaveBeenCalledTimes(1);
        expect(resizeObserver.unobserve).toHaveBeenCalledTimes(0);
        expect(resizeObserver.disconnect).toHaveBeenCalledTimes(0);

        unmount();
    });

    it("provides layout.index prop", () => {
        (["rows", "columns", "masonry"] as LayoutType[]).forEach((layout) => {
            const indexes: string[] = [];
            whenAskedToRender(
                <PhotoAlbum
                    layout={layout}
                    photos={photos}
                    renderPhoto={({ imageProps: { src, alt, ...restImageProps }, layout: { index } }) => {
                        indexes[index] = src;
                        return <img src={src} alt={alt} data-index={index} {...restImageProps} />;
                    }}
                />
            );
            expect(indexes).toStrictEqual(photos.map((photo) => photo.src));
        });
    });

    it("supports components props", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                componentsProps={{
                    containerProps: { style: { margin: "10px" } },
                    rowContainerProps: { style: { backgroundColor: "green" } },
                    imageProps: { style: { cursor: "zoom-in" } },
                }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum
                layout={"columns"}
                photos={photos}
                componentsProps={{
                    containerProps: { style: { margin: "15px" } },
                    columnContainerProps: { style: { backgroundColor: "blue" } },
                    imageProps: { style: { cursor: "zoom-out" } },
                }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum
                layout={"masonry"}
                photos={photos}
                componentsProps={{
                    containerProps: { style: { margin: "20px" } },
                    columnContainerProps: { style: { backgroundColor: "red" } },
                    imageProps: { style: { cursor: "grabbing" } },
                }}
            />
        );

        whenAskedToRender(
            <PhotoAlbum
                layout={"masonry"}
                photos={photos}
                componentsProps={(containerWidth) => ({
                    containerProps: { style: { margin: containerWidth < 400 ? "10px" : "20px" } },
                })}
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
                renderContainer={({ children, containerRef }: RenderContainerProps) => (
                    <div ref={containerRef} key={1}>
                        {children}
                    </div>
                )}
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
                renderContainer={({ children, containerRef }: RenderContainerProps) => (
                    <div ref={containerRef} key={2}>
                        {children}
                    </div>
                )}
                resizeObserverProvider={resizeObserverProvider}
            />
        );

        unmount();

        expect(resizeObserverMock.observe.mock.calls.length).toBe(2);
        expect(resizeObserverMock.disconnect.mock.calls.length).toBe(2);
    });

    it("supports custom wrapper", () => {
        whenAskedToRender(
            <PhotoAlbum
                layout={"rows"}
                photos={photos}
                renderPhoto={({ wrapperStyle, renderDefaultPhoto }) => (
                    <div style={wrapperStyle}>{renderDefaultPhoto({ wrapped: true })}</div>
                )}
            />
        );
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
