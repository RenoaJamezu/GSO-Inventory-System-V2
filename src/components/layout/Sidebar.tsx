import { LogOut } from "lucide-react";

import { useLogout } from "@/features/auth";

import SidebarItem from "./SidebarItem";
import { navigation } from "@/app/router/navigation";
import { ConfirmDialog } from "../dialog";
import { useState } from "react";

export default function Sidebar() {
  const logout = useLogout();

  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}

        <div className="border-b border-gray-500 px-6 py-6">
          <h1 className="text-xl font-bold text-green-700">
            Municipality of Sibagat
          </h1>

          <p className="text-sm text-gray-500">General Services Office</p>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarItem
                key={item.path}
                to={item.path}
                icon={<Icon size={20} />}
                label={item.label}
              />
            );
          })}
        </nav>

        {/* Footer */}

        <div className="border-t border-gray-500 p-4">
          <button
            onClick={() => setConfirmLogout(true)}
            className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-4
            py-3
            text-red-600
            transition-colors
            hover:bg-red-50
          "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
}
