import clsx from "clsx";
import type React from "react";

import classes from "./StyledLink.module.css";

export default function StyledLink({ href, className, children, ...rest }: React.ComponentProps<"a">) {
  return (
    <a href={href} className={clsx(classes.link, className)} {...rest}>
      {children}
    </a>
  );
}
