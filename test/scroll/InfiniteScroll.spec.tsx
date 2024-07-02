import { RowsPhotoAlbum } from "../../src";
import { UnstableInfiniteScroll as InfiniteScroll } from "../../src/scroll";
import { act, fireEvent, render } from "../test-utils";
import photos from "../photos";

async function triggerIntersection() {
  await act(() => fireEvent(window, new Event("intersect")));
}

function fetcher(index: number) {
  return Promise.resolve(index === 0 ? photos : null);
}

describe("InfiniteScroll", () => {
  it("supports initial photos", () => {
    const { getPhotos } = render(
      <InfiniteScroll singleton fetch={fetcher} photos={photos}>
        <RowsPhotoAlbum photos={[]} />
      </InfiniteScroll>,
    );
    expect(getPhotos().length).toBe(photos.length);
  });

  it("loads photos asynchronously", async () => {
    const { getPhotos, queryByText } = await act(async () =>
      render(
        <InfiniteScroll fetch={fetcher} finished="Done">
          <RowsPhotoAlbum photos={[]} />
        </InfiniteScroll>,
      ),
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

    const { queryByText } = await act(async () =>
      render(
        <InfiniteScroll
          fetch={() => {
            throw new Error();
          }}
          retries={1}
          error="Error"
        >
          <RowsPhotoAlbum photos={[]} />
        </InfiniteScroll>,
      ),
    );

    await triggerIntersection();
    await triggerIntersection();
    await triggerIntersection();
    await act(vi.runAllTimers);
    expect(queryByText("Error")).toBeTruthy();

    vi.useRealTimers();
  });
});
