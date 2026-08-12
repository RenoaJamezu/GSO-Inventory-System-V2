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
          "flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
          collapsed ? "w-20" : "w-72",
        ].join(" ")}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <nav className="flex-1 space-y-6 p-4">
          {sidebarSections.map((section, index) => (
            <SidebarSection
              key={index}
              section={section}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <SidebarFooter
          collapsed={collapsed}
          onLogout={() => setConfirmLogout(true)}
        />
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={logout}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
