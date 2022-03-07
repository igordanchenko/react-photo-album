import { useRef } from "react";

const arraysEqual = (a: number[] | undefined, b: number[] | undefined) => {
    if (!a || !b || a.length !== b.length) return false;

    for (let i = 0, l = a.length; i < l; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
};

/** A hook providing stable ref for the array */
const useArray = (array: number[] | undefined) => {
    const ref = useRef(array);

    if (!arraysEqual(array, ref.current)) {
        ref.current = array;
    }

    return ref.current;
};

export default useArray;
