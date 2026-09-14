import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-600 " +
    "dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus:ring-emerald-500",

  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400 " +
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-600",

  danger:
    "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 " +
    "dark:bg-red-700 dark:hover:bg-red-600",

  success:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-600 " +
    "dark:bg-emerald-600 dark:hover:bg-emerald-500",

  warning:
    "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 " +
    "dark:bg-amber-600 dark:hover:bg-amber-500",

  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300 " +
    "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-slate-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-11 px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
