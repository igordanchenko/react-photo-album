import * as React from "react";
import { Page } from "playwright-core";
import { expect, test } from "@playwright/experimental-ct-react";

import PhotoAlbum from "./PhotoAlbum";

const forEachViewport = async (
    page: Page,
    callback: ({ matchScreenshot }: { matchScreenshot: (name: string) => Promise<void> }) => Promise<void>
) => {
    for (const viewport of [600, 900, 1200]) {
        await page.setViewportSize({ width: viewport, height: viewport });

        await callback({
            matchScreenshot: async (name: string) => {
                await expect(page).toHaveScreenshot(`${name}-${viewport}.png`);
            },
        });
    }
};

test("rows", async ({ mount, page }) => {
    await forEachViewport(page, async ({ matchScreenshot }) => {
        for (const targetRowHeight of [100, 150, 200, 300]) {
            await mount(<PhotoAlbum layout="rows" targetRowHeight={targetRowHeight} />);
            await matchScreenshot(`rows-${targetRowHeight}`);
        }
    });
});

test("columns", async ({ mount, page }) => {
    await forEachViewport(page, async ({ matchScreenshot }) => {
        for (const columns of [2, 3, 4, 5]) {
            await mount(<PhotoAlbum layout="columns" columns={columns} />);
            await matchScreenshot(`columns-${columns}`);
        }
    });
});

test("masonry", async ({ mount, page }) => {
    await forEachViewport(page, async ({ matchScreenshot }) => {
        for (const columns of [2, 3, 4, 5]) {
            await mount(<PhotoAlbum layout="masonry" columns={columns} />);
            await matchScreenshot(`masonry-${columns}`);
        }
    });
});
