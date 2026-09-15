import type { HTMLAttributes, ReactNode } from "react";

export type PageToolbarProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  primary?: ReactNode;
  secondary?: ReactNode;
};

export default function PageToolbar({
  primary,
  secondary,
  className = "",
  ...props
}: PageToolbarProps) {
  return (
    <section
      {...props}
      className={[
        "flex flex-col gap-3",
        "lg:flex-row",
        "lg:items-center",
        "lg:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {primary && <div className="min-w-0 flex-1">{primary}</div>}

      {secondary && (
        <div
          className="
            flex shrink-0
            flex-wrap items-center
            gap-2
          "
        >
          {secondary}
        </div>
      )}
    </section>
  );
}
