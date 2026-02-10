import { describe, expect, it, vi } from "vitest";

import PhotoAlbum from "../../src";
import { render, renderAndMatchSnapshot } from "../test-utils";
import photos from "../photos";

describe("PhotoAlbum", () => {
  it("supports rows layout", () => {
    renderAndMatchSnapshot(<PhotoAlbum layout="rows" photos={photos} />);
  });

  it("supports columns layout", () => {
    renderAndMatchSnapshot(<PhotoAlbum layout="columns" photos={photos} />);
  });

  it("supports masonry layout", () => {
    renderAndMatchSnapshot(<PhotoAlbum layout="masonry" photos={photos} />);
  });

  it("doesn't crash with unknown layout", () => {
    renderAndMatchSnapshot(
      <PhotoAlbum
        // @ts-expect-error - expected error
        layout="unknown"
        photos={photos}
      />,
    );
  });

  it("supports breakpoints", () => {
    const { getContainerWidth } = render(<PhotoAlbum layout="rows" photos={photos} breakpoints={[600, 900, 1200]} />);

    expect(getContainerWidth()).toBe(900);

    window.resizeTo(800, 600);
    expect(getContainerWidth()).toBe(600);
  });

  it("supports responsive sizes", () => {
    renderAndMatchSnapshot(<PhotoAlbum layout="rows" photos={photos} sizes={{ size: "50vw" }} />);

    renderAndMatchSnapshot(
      <PhotoAlbum
        layout="rows"
        photos={photos.map((photo) => ({
          ...photo,
          srcSet: [{ src: photo.src, width: Math.round(photo.width / 2), height: Math.round(photo.height / 2) }],
        }))}
        sizes={{
          size: "1200px",
          sizes: [{ viewport: "(max-width: 1200px)", size: "100vw" }],
        }}
      />,
    );

    renderAndMatchSnapshot(
      <PhotoAlbum
        layout="rows"
        photos={photos.map((photo) => ({
          ...photo,
          srcSet: [
            { ...photo },
            {
              src: photo.src,
              width: Math.round(photo.width / 2),
              height: Math.round(photo.height / 2),
            },
          ],
        }))}
        sizes={{
          size: "1200px",
          sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 64px)" }],
        }}
      />,
    );
  });

  it("supports links", () => {
    const { getAllByRole } = render(
      <PhotoAlbum layout="rows" photos={photos.map((photo) => ({ ...photo, href: photo.src }))} />,
    );
    expect(getAllByRole("link").length).toBe(photos.length);
  });

  it("supports onClick callback", () => {
    const onClick = vi.fn();

    const { getAllByRole } = render(<PhotoAlbum layout="rows" photos={photos} onClick={onClick} />);
    getAllByRole("button").forEach((el) => el.click());

    expect(onClick).toHaveBeenCalledTimes(photos.length);
  });

  it("supports render functions", () => {
    const { getAllByTestId, getPhotos, rerender } = render(
      <PhotoAlbum
        layout="rows"
        photos={photos}
        render={{
          container: ({ ref, ...props }) => <div ref={ref} data-testid="container" {...props} />,
          track: (props) => <div data-testid="track" {...props} />,
          image: ({ src, alt, ...props }) => <img src={src} alt={alt} data-testid="image" {...props} />,
          extras: () => <span data-testid="extras" />,
        }}
      />,
    );

    expect(getAllByTestId("container").length).toBe(1);
    expect(getAllByTestId("track").length).toBe(7);
    expect(getAllByTestId("image").length).toBe(photos.length);
    expect(getAllByTestId("extras").length).toBe(photos.length);

    rerender(
      <PhotoAlbum
        layout="rows"
        photos={photos}
        render={{
          photo: (_, { index }) => <span key={index} data-testid="photo" />,
        }}
      />,
    );
    expect(getAllByTestId("photo").length).toBe(photos.length);

    rerender(<PhotoAlbum layout="rows" photos={photos} render={{ photo: () => null, image: () => null }} />);
    expect(getPhotos().length).toBe(photos.length);
  });

  it("supports ARIA labels", () => {
    const { getAllByLabelText } = render(
      <PhotoAlbum layout="rows" photos={photos.map((photo) => ({ ...photo, label: "Button" }))} onClick={() => {}} />,
    );

    expect(getAllByLabelText("Button").length).toBe(photos.length);
  });

  it("prevents infinite resize loop", () => {
    window.__TEST__.scrollbarWidth = 15;
    window.resizeTo(1024, 768);

    const { getContainerWidth } = render(<PhotoAlbum layout="rows" photos={photos} />);

    expect(getContainerWidth()).toBe(1009);

    // scrollbar disappears — width grows (first bounce goes through)
    window.__TEST__.scrollbarWidth = 0;
    window.resizeTo(1024, 768);
    expect(getContainerWidth()).toBe(1024);

    // scrollbar reappears — oscillation detected, settles on smaller width
    window.__TEST__.scrollbarWidth = 15;
    window.resizeTo(1024, 768);
    expect(getContainerWidth()).toBe(1009);

    // scrollbar disappears again — suppressed
    window.__TEST__.scrollbarWidth = 0;
    window.resizeTo(1024, 768);
    expect(getContainerWidth()).toBe(1009);

    // subsequent re-renders are stable
    window.resizeTo(1024, 768);
    expect(getContainerWidth()).toBe(1009);
  });

  it("forwards ref", () => {
    const ref = { current: null };
    const refSetter = vi.spyOn(ref, "current", "set");
    render(<PhotoAlbum ref={ref} layout="rows" photos={photos} />);
    expect(refSetter).toHaveBeenCalled();
  });

  it("forwards callback ref", () => {
    const callbackRef = vi.fn();
    render(<PhotoAlbum ref={callbackRef} layout="rows" photos={photos} />);
    expect(callbackRef).toHaveBeenCalled();
  });
});
