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

export function mockObserver<MockEntry extends {}>(event: string, mockEntry?: () => MockEntry) {
  return vi.fn().mockImplementation((callback) => {
    const targets: Element[] = [];

    const listener = () => {
      act(() => {
        callback(targets.map((target) => ({ target, ...mockEntry?.() })));
      });
    };

    window.addEventListener(event, listener);

    return {
      observe: (target: Element) => {
        targets.push(target);
      },
      unobserve: (target: Element) => {
        targets.splice(targets.indexOf(target), 1);
      },
      disconnect: () => {
        window.removeEventListener(event, listener);
      },
    };
  });
}

export * from "@testing-library/react";
export { customRender as render };
