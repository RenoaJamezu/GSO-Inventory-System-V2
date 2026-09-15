import type { InputHTMLAttributes, ReactNode } from "react";

export type FormCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export default function FormCheckbox({
  label,
  description,
  icon,
  className = "",
  checked,
  disabled,
  ...props
}: FormCheckboxProps) {
  return (
    <label
      className={[
        "flex items-start gap-3",
        "rounded-md border p-3",
        "transition-colors duration-150",

        "border-slate-200 bg-white",
        "dark:border-slate-700 dark:bg-slate-900",

        disabled
          ? "cursor-not-allowed opacity-60"
          : [
              "cursor-pointer",
              "hover:bg-slate-50",
              "dark:hover:bg-slate-800/70",
            ].join(" "),

        checked
          ? [
              "border-emerald-300 bg-emerald-50/50",
              "dark:border-emerald-800",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className={[
          "mt-0.5 h-4 w-4 shrink-0 rounded",
          "border-slate-300",
          "text-emerald-700",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-emerald-600/20",
          "disabled:cursor-not-allowed",
          "dark:border-slate-600",
          "dark:bg-slate-800",
          "dark:text-emerald-500",
          "dark:focus-visible:ring-emerald-500/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {(icon || label || description) && (
        <div className="min-w-0 flex-1">
          {(icon || label) && (
            <div className="flex items-center gap-2">
              {icon && (
                <span
                  className="
                    text-slate-500
                    dark:text-slate-400
                  "
                  aria-hidden="true"
                >
                  {icon}
                </span>
              )}

              {label && (
                <span
                  className="
                    text-sm font-medium
                    text-slate-800
                    dark:text-slate-200
                  "
                >
                  {label}
                </span>
              )}
            </div>
          )}

          {description && (
            <div
              className="
                mt-1 text-xs leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {description}
            </div>
          )}
        </div>
      )}
    </label>
  );
}
