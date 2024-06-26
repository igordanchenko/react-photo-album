import { useRef } from "react";

export default function useArray<T>(array: T[] | undefined) {
  const ref = useRef(array);
  if (!array || !ref.current || array.length !== ref.current.length || ref.current.some((el, i) => el !== array[i])) {
    ref.current = array;
  }
  return ref.current;
}
