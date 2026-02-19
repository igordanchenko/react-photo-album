import { describe, expect, it } from "vitest";

import { RowsPhotoAlbum } from "../../src";
import { render, renderAndMatchSnapshot } from "../test-utils";
import photos from "../photos";

describe("RowsPhotoAlbum", () => {
  it("renders without crashing", () => {
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={[]} />);
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={photos} />);
  });

  it("supports default responsive targetRowHeight prop", () => {
    window.resizeTo(1400, 600);
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={photos} />);

    window.resizeTo(800, 600);
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={photos} />);

    window.resizeTo(500, 600);
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={photos} />);

    window.resizeTo(200, 600);
    renderAndMatchSnapshot(<RowsPhotoAlbum photos={photos} />);
  });

  it("supports rowConstraints", () => {
    const { rerender, getTracks, getPhotoAlbum } = render(
      <RowsPhotoAlbum photos={photos} rowConstraints={{ minPhotos: 6 }} />,
    );
    expect(getTracks().length).toBeLessThanOrEqual(4);

    rerender(<RowsPhotoAlbum photos={photos} rowConstraints={{ maxPhotos: 2 }} />);
    expect(getTracks().length).toBeGreaterThanOrEqual(11);

    rerender(<RowsPhotoAlbum photos={photos.slice(0, 0)} rowConstraints={{ singleRowMaxHeight: 100 }} />);
    expect(getPhotoAlbum()?.style.getPropertyValue("max-width")).toBeFalsy();

    // maxWidth must include padding: containerWidth = ratio * maxHeight + (n-1) * spacing + 2 * n * padding
    // with 1 landscape photo (400×200, ratio=2), padding=10, singleRowMaxHeight=100, n=1:
    //   expected = 2 * 100 + 0 + 2 * 10 = 220
    rerender(
      <RowsPhotoAlbum
        photos={[{ src: "a.jpg", width: 400, height: 200 }]}
        padding={10}
        rowConstraints={{ singleRowMaxHeight: 100 }}
      />,
    );
    expect(getPhotoAlbum()?.style.getPropertyValue("max-width")).toBe("220px");
  });

  it("handles impossible layout", () => {
    window.resizeTo(80, 600);
    const { getTracks } = render(<RowsPhotoAlbum photos={photos} spacing={20} padding={50} targetRowHeight={150} />);
    expect(getTracks().length).toBe(0);
  });

  it("supports deterministic tiebreaker", () => {
    window.resizeTo(340, 600);
    render(
      <RowsPhotoAlbum
        photos={Array.from({ length: 7 }, (_, index) => ({ key: `${index}`, ...photos[0] }))}
        spacing={10}
        padding={5}
        targetRowHeight={150}
      />,
    );
  });

  it("supports minPhotos constraint", () => {
    const { getTracks, rerender } = render(<RowsPhotoAlbum photos={photos} />);

    for (const minPhotos of [5, 7, 10]) {
      rerender(<RowsPhotoAlbum photos={photos} rowConstraints={{ minPhotos }} />);
      expect(getTracks().length).toBeGreaterThan(0);
      expect(getTracks().length).toBeLessThanOrEqual(photos.length / minPhotos);
    }
  });

  it("handles zero-dimension photos", () => {
    const photosArray = [
      { src: "zero-height.jpg", width: 100, height: 0 },
      { src: "zero-both.jpg", width: 0, height: 0 },
      ...photos.slice(0, 3),
    ];
    const { getPhotos } = render(<RowsPhotoAlbum photos={photosArray} targetRowHeight={150} />);
    expect(getPhotos().length).toBe(photosArray.length);
  });
});
