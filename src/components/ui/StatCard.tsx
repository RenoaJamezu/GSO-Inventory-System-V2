import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type ColorTheme = "emerald" | "blue" | "orange" | "purple" | "gray";

type StatCardProps = {
  icon: ReactNode;
  colorTheme?: ColorTheme;
  title: string;
  value: string | number;
  description?: string;
  route?: string;
};

const themes: Record<ColorTheme, string> = {
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",

  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",

  orange: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",

  purple:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400",

  gray: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function StatCard({
  icon,
  colorTheme = "emerald",
  title,
  value,
  description,
  route,
}: StatCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (route) navigate(route);
      }}
      className={[
        "rounded-lg border p-5",
        "border-slate-200 bg-white",
        "dark:border-slate-800 dark:bg-slate-900",
        "transition-colors duration-150",
        route
          ? "cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {value}
          </p>

          {description && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
            themes[colorTheme],
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
