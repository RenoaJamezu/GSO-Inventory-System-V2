import type { HTMLAttributes, ReactNode } from "react";

export type DialogHeaderProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export default function DialogHeader({
  title,
  description,
  actions,
  className = "",
  ...props
}: DialogHeaderProps) {
  return (
    <div
      {...props}
      className={[
        "flex shrink-0 items-start justify-between gap-4",
        "border-b border-slate-200",
        "px-5 py-4",
        "dark:border-slate-800",
        "sm:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0 flex-1">
        <h2
          className="
            text-lg font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          {title}
        </h2>

        {description && (
          <div
            className="
              mt-1
              text-sm leading-6
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
    </div>
  );
}
