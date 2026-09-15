import { useState } from "react";

import { ConfirmDialog } from "@/components/dialog";
import { useLogout } from "@/features/auth";

import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import SidebarSection from "./SidebarSection";
import { sidebarSections } from "./sidebar.config";

export type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const logout = useLogout();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutRequest = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  return (
    <>
      <aside
        aria-label="Primary navigation"
        className={[
          "flex h-screen shrink-0 flex-col",
          "border-r border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-900",
          "transition-[width] duration-300",
          collapsed ? "w-20" : "w-72",
        ].join(" ")}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <nav
          aria-label="Main navigation"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
        >
          <div className="space-y-7">
            {sidebarSections.map((section, index) => (
              <SidebarSection
                key={section.title ?? `sidebar-section-${index}`}
                section={section}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>

        <SidebarFooter collapsed={collapsed} onLogout={handleLogoutRequest} />
      </aside>

      <ConfirmDialog
        open={isLogoutDialogOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of the system?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onClose={handleLogoutCancel}
      />
    </>
  );
}
