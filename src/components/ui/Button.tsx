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
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",

  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400",

  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",

  warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400",

  ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",

  md: "px-4 py-2 text-sm",

  lg: "px-5 py-3 text-base",
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
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
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
