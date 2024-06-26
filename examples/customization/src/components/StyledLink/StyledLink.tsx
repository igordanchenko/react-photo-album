import type React from "react";
import clsx from "clsx";

import classes from "./StyledLink.module.css";

export default function StyledLink({ href, className, ...rest }: React.ComponentProps<"a">) {
  return <a href={href} className={clsx(classes.link, className)} {...rest} />;
}
