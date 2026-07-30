import { describe, expect, it } from "vitest";

import { ColumnsPhotoAlbum } from "../../src";
import { render, renderAndMatchSnapshot } from "../test-utils";
import photos from "../photos";

describe("ColumnsPhotoAlbum", () => {
  it("renders without crashing", () => {
    renderAndMatchSnapshot(<ColumnsPhotoAlbum photos={[]} />);
    renderAndMatchSnapshot(<ColumnsPhotoAlbum photos={photos} />);
  });

  it("supports default responsive columns prop", () => {
    const { getTracks } = render(<ColumnsPhotoAlbum photos={photos} />);

    window.resizeTo(1400, 600);
    expect(getTracks().length).toBe(5);

    window.resizeTo(800, 600);
    expect(getTracks().length).toBe(4);

    window.resizeTo(500, 600);
    expect(getTracks().length).toBe(3);

    window.resizeTo(200, 600);
    expect(getTracks().length).toBe(2);
  });

  it("fills first N available columns", () => {
    const { getTracks } = render(<ColumnsPhotoAlbum photos={photos.slice(0, 2)} columns={5} />);
    expect(getTracks().length).toBe(5);
  });

  it("handles impossible layout", () => {
    window.resizeTo(400, 600);
    const { getTracks } = render(<ColumnsPhotoAlbum photos={photos} spacing={20} padding={50} columns={5} />);
    expect(getTracks().length).toBe(3);

    window.resizeTo(80, 600);
    expect(getTracks().length).toBe(0);
  });

  it("handles containers too narrow to partition", () => {
    // the container cannot fit the requested columns, leaving no way to partition the photos
    // into exactly that many columns — the layout falls back to fewer columns instead of throwing
    window.resizeTo(30, 600);
    const photosArray = photos.slice(0, 10);
    const { getTracks, getPhotos } = render(<ColumnsPhotoAlbum photos={photosArray} spacing={30} columns={6} />);
    expect(getTracks().length).toBe(1);
    expect(getPhotos().length).toBe(photosArray.length);
  });

  it("handles zero-dimension photos", () => {
    const photosArray = [
      { src: "zero-height.jpg", width: 100, height: 0 },
      { src: "zero-both.jpg", width: 0, height: 0 },
      ...photos.slice(0, 3),
    ];
    const { getPhotos } = render(<ColumnsPhotoAlbum photos={photosArray} columns={3} />);
    expect(getPhotos().length).toBe(photosArray.length);
  });
});
