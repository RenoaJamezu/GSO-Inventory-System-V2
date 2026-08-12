import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  to: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;

  indicatorColor?: string;
};

export default function SidebarItem({
  to,
  label,
  icon: Icon,
  collapsed,
  indicatorColor,
}: Props) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "group flex items-center rounded-lg px-4 py-3 transition-all duration-200",

          collapsed ? "justify-center" : "gap-3",

          isActive
            ? "bg-gray-200/80 text-black shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        ].join(" ")
      }
    >
      {indicatorColor && !collapsed && (
        <span className={`h-2 w-2 rounded-full ${indicatorColor}`} />
      )}

      <span
        className={[
          "flex shrink-0 items-center justify-center",

          collapsed ? "text-xl" : "text-lg",
        ].join(" ")}
      >
        <Icon size={20} />
      </span>

      <span
        className={[
          "overflow-hidden whitespace-nowrap font-medium transition-all duration-300",

          collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        ].join(" ")}
      >
        {label}
      </span>
    </NavLink>
  );
}
