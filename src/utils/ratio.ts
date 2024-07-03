import { Photo } from "../types";

export default function ratio({ width, height }: Pick<Photo, "width" | "height">) {
  return width / height;
}
