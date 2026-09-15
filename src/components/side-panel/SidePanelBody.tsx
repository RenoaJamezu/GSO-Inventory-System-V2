import type { HTMLAttributes } from "react";

export type SidePanelBodyProps = HTMLAttributes<HTMLDivElement>;

export default function SidePanelBody({
  className = "",
  ...props
}: SidePanelBodyProps) {
  return (
    <div
      {...props}
      className={["min-h-0 flex-1 overflow-y-auto", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
