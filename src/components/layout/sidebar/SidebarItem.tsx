import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  to: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
};

export default function SidebarItem({
  to,
  label,
  icon: Icon,
  collapsed,
}: Props) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "relative flex min-h-11 items-center",
          "rounded-md px-3 py-2.5",
          "text-sm font-medium",
          "transition-colors duration-150",

          collapsed ? "justify-center" : "gap-3",

          isActive
            ? [
                "bg-emerald-50",
                "text-emerald-800",

                "dark:bg-emerald-950/50",
                "dark:text-emerald-300",

                "before:absolute",
                "before:left-0",
                "before:top-2",
                "before:bottom-2",
                "before:w-1",
                "before:rounded-r-full",
                "before:bg-emerald-700",
                "dark:before:bg-emerald-500",
              ].join(" ")
            : [
                "text-slate-600",
                "hover:bg-slate-100",
                "hover:text-slate-900",

                "dark:text-slate-400",
                "dark:hover:bg-slate-800",
                "dark:hover:text-slate-100",
              ].join(" "),
        ].join(" ")
      }
    >
      <Icon size={19} strokeWidth={1.8} className="shrink-0" />

      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
