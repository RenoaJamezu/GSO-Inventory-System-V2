import { LogOut } from "lucide-react";

type Props = {
  collapsed: boolean;
  onLogout: () => void;
};

export default function SidebarFooter({ collapsed, onLogout }: Props) {
  return (
    <div className="border-t border-gray-200 p-4">
      <button
        onClick={onLogout}
        title={collapsed ? "Logout" : undefined}
        className={[
          "flex w-full items-center rounded-lg px-3 py-3",
          "text-red-600 transition-colors",
          "hover:bg-red-50",
          collapsed ? "justify-center" : "gap-3",
        ].join(" ")}
      >
        <LogOut size={20} />

        {!collapsed && <span className="font-medium">Logout</span>}
      </button>
    </div>
  );
}
