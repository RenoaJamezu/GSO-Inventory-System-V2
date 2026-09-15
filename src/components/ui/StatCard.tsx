import type { HTMLAttributes, ReactNode } from "react";

export type StatCardTone = "primary" | "neutral" | "info" | "warning";

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  tone?: StatCardTone;
};

const toneClasses: Record<StatCardTone, string> = {
  primary:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",

  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",

  info: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",

  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
};

export default function StatCard({
  icon,
  label,
  value,
  description,
  tone = "primary",
  className = "",
  ...props
}: StatCardProps) {
  return (
    <div
      {...props}
      className={[
        "rounded-lg border p-5",
        "border-slate-200 bg-white",
        "dark:border-slate-800 dark:bg-slate-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </div>

          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {value}
          </div>

          {description && (
            <div className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
              toneClasses[tone],
            ].join(" ")}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
