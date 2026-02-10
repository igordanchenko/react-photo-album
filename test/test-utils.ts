import type React from "react";
import { expect } from "vitest";
import { render as originalRender, act, fireEvent, type RenderOptions } from "@testing-library/react";

export * from "@testing-library/react";

function getPhotos(container: HTMLElement) {
  return container.querySelectorAll(".react-photo-album--photo") as NodeListOf<HTMLElement>;
}

function getTracks(container: HTMLElement) {
  return container.querySelectorAll(".react-photo-album--track") as NodeListOf<HTMLElement>;
}

function getPhotoAlbum(container: HTMLElement) {
  return container.querySelector(".react-photo-album") as HTMLElement | undefined;
}

function getContainerWidth(container: HTMLElement) {
  const cw = (container.firstChild as HTMLElement | null)?.style.getPropertyValue(
    "--react-photo-album--container-width",
  );
  return cw ? Number.parseInt(cw, 10) : undefined;
}

export function render(ui: React.ReactElement, options?: RenderOptions) {
  const { container, ...rest } = originalRender(ui, options);

  return {
    container,
    getPhotos: () => getPhotos(container),
    getTracks: () => getTracks(container),
    getPhotoAlbum: () => getPhotoAlbum(container),
    getContainerWidth: () => getContainerWidth(container),
    ...rest,
  };
}

export function renderAndMatchSnapshot(ui: React.ReactElement, options?: RenderOptions) {
  expect(render(ui, options).asFragment()).toMatchSnapshot();
}

export async function triggerIntersection() {
  await act(async () => fireEvent(window, new Event("intersect")));
}
