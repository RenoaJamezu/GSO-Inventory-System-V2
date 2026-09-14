import type { InputHTMLAttributes, ReactNode } from "react";

type ColorTheme = "emerald" | "blue" | "orange" | "purple" | "gray";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  colorTheme?: ColorTheme;
};

export default function FormCheckbox({
  label,
  description,
  icon,
  colorTheme,
  className = "",
  checked,
  ...props
}: Props) {
  return (
    <label
      data-color-theme={colorTheme}
      className={[
        "flex cursor-pointer items-start gap-3",
        "rounded-md border p-3",
        "transition-colors",

        "border-slate-200 bg-white",
        "hover:bg-slate-50",

        "dark:border-slate-700",
        "dark:bg-slate-900",
        "dark:hover:bg-slate-800/70",

        checked
          ? [
              "border-emerald-300 bg-emerald-50/50",
              "dark:border-emerald-800",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        {...props}
        className={[
          "mt-0.5 h-4 w-4 shrink-0 rounded",
          "border-slate-300",
          "text-emerald-700",
          "focus:ring-2",
          "focus:ring-emerald-600/20",

          "dark:border-slate-600",
          "dark:bg-slate-800",
          "dark:text-emerald-500",
          "dark:focus:ring-emerald-500/20",

          className,
        ].join(" ")}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-slate-500 dark:text-slate-400">{icon}</span>
          )}

          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
