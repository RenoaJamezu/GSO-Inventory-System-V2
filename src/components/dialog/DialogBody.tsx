import type { HTMLAttributes } from "react";

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

export default function DialogBody({
  className = "",
  ...props
}: DialogBodyProps) {
  return (
    <div
      {...props}
      className={[
        "min-h-0 flex-1 overflow-y-auto",
        "px-5 py-5",
        "sm:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
