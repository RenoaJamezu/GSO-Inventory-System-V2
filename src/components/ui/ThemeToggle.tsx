import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

type Props = {
  collapsed?: boolean;
};

export default function ThemeToggle({ collapsed = false }: Props) {
  const { theme, toggleTheme } = useTheme();

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={
        collapsed
          ? dark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : undefined
      }
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "flex min-h-11 w-full items-center rounded-md px-3 py-2.5",
        "text-sm font-medium",
        "text-slate-600 transition-colors",
        "hover:bg-slate-100 hover:text-slate-900",
        "dark:text-slate-300",
        "dark:hover:bg-slate-800",
        "dark:hover:text-white",
        collapsed ? "justify-center" : "gap-3",
      ].join(" ")}
    >
      {dark ? (
        <Sun size={19} strokeWidth={1.8} />
      ) : (
        <Moon size={19} strokeWidth={1.8} />
      )}

      {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}
