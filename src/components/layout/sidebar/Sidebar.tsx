import { useState } from "react";

import { ConfirmDialog } from "@/components/dialog";
import { useLogout } from "@/features/auth";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarSection from "./SidebarSection";
import { sidebarSections } from "./sidebar.config";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: Props) {
  const logout = useLogout();

  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      <aside
        className={[
          "flex h-screen shrink-0 flex-col",
          "border-r border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-900",
          "transition-[width] duration-300",
          collapsed ? "w-20" : "w-72",
        ].join(" ")}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-7">
            {sidebarSections.map((section, index) => (
              <SidebarSection
                key={index}
                section={section}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>

        <SidebarFooter
          collapsed={collapsed}
          onLogout={() => setConfirmLogout(true)}
        />
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of the system?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={logout}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
