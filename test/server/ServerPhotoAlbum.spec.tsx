import { describe, expect, it } from "vitest";

import { LayoutType } from "../../src";
import ServerPhotoAlbum from "../../src/server";
import { render } from "../test-utils";
import photos from "../photos";

describe("ServerPhotoAlbum", () => {
  const breakpoints = [300, 600, 900];

  it.each(["rows", "columns", "masonry"])(`supports %s layout`, (layout) => {
    const { getPhotos } = render(
      <ServerPhotoAlbum layout={layout as LayoutType} photos={photos} breakpoints={breakpoints} />,
    );
    expect(getPhotos().length).toBe(photos.length * (breakpoints.length + 1));
  });

  it("supports custom class names", () => {
    const { container } = render(
      <ServerPhotoAlbum
        unstyled
        layout="rows"
        photos={photos}
        breakpoints={breakpoints}
        classNames={{
          container: "container-class",
          breakpoints: {
            150: "breakpoint-150",
            300: "breakpoint-300",
            600: "breakpoint-600",
            900: "breakpoint-900",
          },
        }}
      />,
    );

    expect(container.querySelector(".container-class")).not.toBeNull();
    expect(container.querySelector(".breakpoint-150")).not.toBeNull();
    expect(container.querySelector(".breakpoint-300")).not.toBeNull();
    expect(container.querySelector(".breakpoint-600")).not.toBeNull();
    expect(container.querySelector(".breakpoint-900")).not.toBeNull();
  });

  it("doesn't crash with invalid props", () => {
    const { getTracks, getPhotoAlbum, rerender } = render(
      <ServerPhotoAlbum
        // @ts-expect-error - expected error
        layout="unknown"
        photos={photos}
        breakpoints={breakpoints}
      />,
    );
    expect(getTracks().length).toBe(0);

    rerender(
      <ServerPhotoAlbum
        layout="rows"
        // @ts-expect-error - expected error
        photos={undefined}
        breakpoints={breakpoints}
      />,
    );
    expect(getPhotoAlbum()).toBe(null);

    rerender(
      <ServerPhotoAlbum
        layout="rows"
        // @ts-expect-error - expected error
        photos={undefined}
        breakpoints={breakpoints}
      />,
    );
    expect(getPhotoAlbum()).toBe(null);
  });
});
