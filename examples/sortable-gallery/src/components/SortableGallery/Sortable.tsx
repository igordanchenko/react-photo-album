import { cloneElement, ReactElement, RefAttributes } from "react";
import { useSortable } from "@dnd-kit/sortable";

type SortableProps = {
  id: string;
  children: ReactElement<RefAttributes<HTMLElement> & Record<`data-${string}`, unknown>>;
};

export default function Sortable({ id, children }: SortableProps) {
  const { attributes, listeners, isDragging, index, activeIndex, over, setNodeRef } = useSortable({ id });

  return cloneElement(children, {
    ref: setNodeRef,
    "data-active": isDragging,
    "data-position":
      activeIndex >= 0 && over?.id === id && !isDragging ? (index > activeIndex ? "after" : "before") : undefined,
    ...attributes,
    ...listeners,
  });
}
