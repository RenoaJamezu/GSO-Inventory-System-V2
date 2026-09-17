import { Moon, Sun } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { useTheme } from "@/hooks/useTheme";

export type ThemeToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "children"
> & {
  showLabel?: boolean;
};

export default function ThemeToggle({
  showLabel = false,
  className = "",
  ...props
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      {...props}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={!showLabel ? label : undefined}
      className={[
        "flex min-h-11 w-full items-center rounded-md px-3 py-2.5",
        "text-sm font-medium",
        "text-slate-600",
        "transition-colors duration-150",
        "hover:bg-slate-100 hover:text-slate-900",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-emerald-600",
        "focus-visible:ring-offset-2",
        "dark:text-slate-300",
        "dark:hover:bg-slate-800",
        "dark:hover:text-white",
        "dark:focus-visible:ring-emerald-500",
        showLabel ? "gap-2 px-3 py-2" : "justify-center h-10 w-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.8} aria-hidden="true" />
      )}

      {showLabel && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}
