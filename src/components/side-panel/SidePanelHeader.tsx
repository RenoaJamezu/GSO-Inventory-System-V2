import type { HTMLAttributes, ReactNode } from "react";

export type SidePanelHeaderProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export default function SidePanelHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
  ...props
}: SidePanelHeaderProps) {
  return (
    <header
      {...props}
      className={[
        "flex shrink-0 items-start justify-between gap-4",
        "border-b border-slate-200",
        "px-6 py-5",
        "dark:border-slate-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div
            className="
              text-xs font-semibold
              uppercase tracking-wide
              text-emerald-700
              dark:text-emerald-400
            "
          >
            {eyebrow}
          </div>
        )}

        <h2
          className={[
            "truncate text-xl font-semibold",
            "text-slate-900",
            "dark:text-slate-100",
            eyebrow ? "mt-1" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h2>

        {description && (
          <div
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
