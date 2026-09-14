import { LogOut } from "lucide-react";

import { ThemeToggle } from "@/components/ui";

type Props = {
  collapsed: boolean;
  onLogout: () => void;
};

export default function SidebarFooter({ collapsed, onLogout }: Props) {
  return (
    <footer className="border-t border-slate-200 p-3 dark:border-slate-800">
      {!collapsed && (
        <div className="mb-2 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            General Services Office
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Municipality of Sibagat
          </p>
        </div>
      )}

      <div className="space-y-1">
        <ThemeToggle collapsed={collapsed} />

        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={[
            "flex min-h-11 w-full items-center rounded-md px-3 py-2.5",
            "text-sm font-medium",
            "text-slate-600 transition-colors",
            "hover:bg-red-50 hover:text-red-700",
            "dark:text-slate-300",
            "dark:hover:bg-red-950/40",
            "dark:hover:text-red-400",
            collapsed ? "justify-center" : "gap-3",
          ].join(" ")}
        >
          <LogOut size={19} strokeWidth={1.8} />

          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </footer>
  );
}
