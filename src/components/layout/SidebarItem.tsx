import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

export default function SidebarItem({ to, icon, label }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
          isActive
            ? "bg-green-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        ].join(" ")
      }
    >
      <span className="text-lg">{icon}</span>

      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
