import { describe, it } from "vitest";

import { computeColumnsLayout, computeMasonryLayout, computeRowsLayout, StaticPhotoAlbum } from "../../src";
import { renderAndMatchSnapshot } from "../test-utils";
import photos from "../photos";

describe("StaticPhotoAlbum", () => {
  it("supports rows layout", () => {
    renderAndMatchSnapshot(<StaticPhotoAlbum layout="rows" model={computeRowsLayout(photos, 10, 10, 800, 150)} />);
  });

  it("supports columns layout", () => {
    renderAndMatchSnapshot(<StaticPhotoAlbum layout="columns" model={computeColumnsLayout(photos, 10, 10, 800, 3)} />);
  });

  it("supports masonry layout", () => {
    renderAndMatchSnapshot(<StaticPhotoAlbum layout="masonry" model={computeMasonryLayout(photos, 10, 10, 800, 3)} />);
  });
});
