import * as React from "react";

export default function useArray<T>(array: T[] | undefined) {
  const ref = React.useRef(array);
  if (!array || !ref.current || array.join() !== ref.current.join()) {
    ref.current = array;
  }
  return ref.current;
}
