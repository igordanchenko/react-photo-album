export default function clsx(...classes: (string | boolean | undefined)[]) {
  return [...classes].filter((cls) => Boolean(cls)).join(" ");
}
