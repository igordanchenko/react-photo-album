import type React from "react";
import { act, render, RenderOptions } from "@testing-library/react";

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

function customRender(ui: React.ReactElement, options?: RenderOptions) {
  const { container, ...rest } = render(ui, options);

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
  expect(customRender(ui, options).asFragment()).toMatchSnapshot();
}

export function mockObserver(event: string, entries?: () => unknown) {
  return vi.fn().mockImplementation((observer) => {
    const listener = () => {
      act(() => {
        observer(entries?.());
      });
    };
    const observe = () => window.addEventListener(event, listener);
    const unobserve = () => window.removeEventListener(event, listener);
    return { observe, unobserve, disconnect: unobserve };
  });
}

export * from "@testing-library/react";
export { customRender as render };
