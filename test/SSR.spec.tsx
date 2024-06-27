import { RowsPhotoAlbum, UnstableSSR as SSR } from "../src";
import { render } from "./test-utils";
import photos from "./photos";

describe("SSR", () => {
  it("works as expected", () => {
    const { getTracks, rerender } = render(
      <SSR breakpoints={[]}>
        <RowsPhotoAlbum photos={photos} />
      </SSR>,
    );
    expect(getTracks().length).toBe(0);

    rerender(
      <SSR breakpoints={[300, 600, 900]}>
        <RowsPhotoAlbum photos={photos.slice(0, 1)} />
      </SSR>,
    );
    expect(getTracks().length).toBe(1);
  });
});
