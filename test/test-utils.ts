import type React from "react";
import { render, RenderOptions } from "@testing-library/react";

function getTracks(container: HTMLElement) {
  return container.querySelectorAll(".react-photo-album--track") as NodeListOf<HTMLElement>;
}

function getContainer(container: HTMLElement) {
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
    getTracks: () => getTracks(container),
    getContainer: () => getContainer(container),
    getContainerWidth: () => getContainerWidth(container),
    ...rest,
  };
}

function renderAndMatchSnapshot(ui: React.ReactElement, options?: RenderOptions) {
  expect(customRender(ui, options).asFragment()).toMatchSnapshot();
}

export * from "@testing-library/react";
export { customRender as render, renderAndMatchSnapshot };
