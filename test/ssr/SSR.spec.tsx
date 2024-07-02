import { RowsPhotoAlbum } from "../../src";
import { UnstableSSR as SSR } from "../../src/ssr";
import { render } from "../test-utils";
import photos from "../photos";

describe("SSR", () => {
  const breakpoints = [300, 600, 900];

  it("works as expected", () => {
    const { getTracks, rerender } = render(
      <SSR breakpoints={[]}>
        <RowsPhotoAlbum photos={photos} />
      </SSR>,
    );
    expect(getTracks().length).toBe(0);

    rerender(
      <SSR breakpoints={breakpoints}>
        <RowsPhotoAlbum photos={photos.slice(0, 1)} />
      </SSR>,
    );
    expect(getTracks().length).toBe(1);
  });

  it("supports custom class names", () => {
    const { container } = render(
      <SSR
        unstyled
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
      >
        <RowsPhotoAlbum photos={photos} />
      </SSR>,
    );

    expect(container.querySelector(".container-class")).not.toBeNull();
    expect(container.querySelector(".breakpoint-900")).not.toBeNull();
  });
});
