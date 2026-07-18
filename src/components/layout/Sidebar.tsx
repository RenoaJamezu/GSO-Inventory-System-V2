import { Boxes, ChartColumnIncreasing, FileText, LayoutDashboard, LogOut, Package } from "lucide-react";

import { useLogout } from "@/features/auth";

import { ConfirmDialog } from "../dialog";
import { useState } from "react";
import { NavLink } from "react-router-dom";

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
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="text-lg"><LayoutDashboard /></span>

            <span className="font-medium">Dashboard</span>
          </NavLink>
          
          <h5 className="text-sm text-gray-500 font-bold">Inventory</h5>
          <NavLink
            to="/par"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="rounded-full bg-blue-500 p-1"/>

            <span className="text-lg"><FileText /></span>

            <span className="font-medium">PAR Inventory</span>
          </NavLink>
          <NavLink
            to="/high-cost"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="rounded-full bg-orange-500 p-1"/>

            <span className="text-lg"><Package /></span>

            <span className="font-medium">High Cost Inventory</span>
          </NavLink>
          <NavLink
            to="/low-cost"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="rounded-full bg-purple-500 p-1"/>

            <span className="text-lg"><Boxes /></span>

            <span className="font-medium">Low Cost Inventory</span>
          </NavLink>

          <h5 className="text-sm text-gray-500 font-bold">Workspace</h5>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="text-lg"><ChartColumnIncreasing /></span>

            <span className="font-medium">Reports</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "bg-gray-200/75 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="text-lg"><LayoutDashboard /></span>

            <span className="font-medium">Settings</span>
          </NavLink>
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
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
