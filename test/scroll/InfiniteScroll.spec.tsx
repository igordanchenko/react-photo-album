import { describe, expect, it, vi } from "vitest";

import { MasonryPhotoAlbum, RowsPhotoAlbum } from "../../src";
import InfiniteScroll from "../../src/scroll";
import { act, render, triggerIntersection } from "../test-utils";
import photos from "../photos";

function fetcher(index: number) {
  return Promise.resolve(index === 0 ? photos : null);
}

describe("InfiniteScroll", () => {
  it("supports initial photos", () => {
    const { getPhotos } = render(
      <InfiniteScroll singleton fetch={fetcher} photos={photos}>
        <MasonryPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );
    expect(getPhotos().length).toBe(photos.length);
  });

  it("loads photos asynchronously", async () => {
    const { getPhotos, queryByText } = render(
      <InfiniteScroll fetch={fetcher} finished="Done">
        <RowsPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );
    expect(getPhotos().length).toBe(0);

    await triggerIntersection();
    expect(getPhotos().length).toBe(photos.length);
    expect(queryByText("Done")).toBeFalsy();

    await triggerIntersection();
    expect(getPhotos().length).toBe(photos.length);
    expect(queryByText("Done")).toBeTruthy();
  });

  it("handles fetch errors", async () => {
    vi.useFakeTimers();

    try {
      const { queryByText } = render(
        <InfiniteScroll
          fetch={() => {
            throw new Error();
          }}
          retries={1}
          error="Error"
        >
          <RowsPhotoAlbum photos={[]} />
        </InfiniteScroll>,
      );

      await triggerIntersection();
      await triggerIntersection();
      await triggerIntersection();
      await act(async () => vi.runAllTimers());
      expect(queryByText("Error")).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("unloads offscreen photos", async () => {
    const { getPhotos } = render(
      <InfiniteScroll singleton fetch={fetcher} photos={photos}>
        <RowsPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );

    await triggerIntersection();
    expect(getPhotos().length).toBe(photos.length);

    window.isIntersecting = false;
    await triggerIntersection();
    expect(getPhotos().length).toBe(0);
  });

  it("supports the onClick callback", async () => {
    const onClick = vi.fn();

    const { getAllByRole } = render(
      <InfiniteScroll singleton fetch={fetcher} photos={photos} onClick={onClick}>
        <RowsPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );

    act(() => {
      getAllByRole("button")[0].click();
    });

    expect(onClick).toHaveBeenCalled();
  });

  it("supports scroll container", async () => {
    const scrollContainer = vi.fn();

    render(
      <InfiniteScroll singleton fetch={fetcher} photos={photos} scrollContainer={scrollContainer}>
        <RowsPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );

    expect(scrollContainer).toHaveBeenCalled();
  });
});
