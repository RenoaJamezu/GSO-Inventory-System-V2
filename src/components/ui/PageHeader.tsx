import type { HTMLAttributes, ReactNode } from "react";

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  actions,
  className = "",
  ...props
}: PageHeaderProps) {
  return (
    <header
      {...props}
      className={[
        "flex flex-col gap-4",
        "border-b border-slate-200 pb-5",
        "dark:border-slate-800",
        "md:flex-row md:items-start md:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0 flex-1">
        <h1
          className="
            text-2xl font-bold tracking-tight
            text-slate-900
            dark:text-slate-100
          "
        >
          {title}
        </h1>

        {description && (
          <div
            className="
              mt-1.5 max-w-3xl
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
        <div
          className="
            flex shrink-0
            flex-wrap items-center
            gap-2
          "
        >
          {actions}
        </div>
      )}
    </header>
  );
}
