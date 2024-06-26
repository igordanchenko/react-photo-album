import type React from "react";
import { MdCheckCircleOutline, MdOutlineCircle } from "react-icons/md";

import classes from "./SelectIcon.module.css";

type SelectIconProps = {
  selected: boolean | undefined;
  onClick: React.MouseEventHandler;
  color?: string;
  size?: string | number;
};

export default function SelectIcon({ selected, onClick, color = "white", size = "24px" }: SelectIconProps) {
  const Icon = selected ? MdCheckCircleOutline : MdOutlineCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes.button}
      aria-label={selected ? "Deselect image" : "Select image"}
    >
      <Icon color={color} size={size} className={classes.icon} focusable={false} aria-hidden="true" />
    </button>
  );
}
