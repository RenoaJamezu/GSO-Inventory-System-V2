import type { HTMLAttributes, ReactNode } from "react";

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={[
        "flex flex-col items-center justify-center",
        "px-6 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <div
          className="
            mb-3
            text-slate-300
            dark:text-slate-600
          "
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <div
        className="
          text-sm font-semibold
          text-slate-900
          dark:text-slate-100
        "
      >
        {title}
      </div>

      {description && (
        <div
          className="
            mt-1
            max-w-md
            text-sm leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </div>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
