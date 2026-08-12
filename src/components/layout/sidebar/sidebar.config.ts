import {
  Boxes,
  ChartColumnIncreasing,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  indicatorColor?: string;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Inventory",

    items: [
      {
        to: "/par",
        label: "PAR Inventory",
        icon: FileText,
        indicatorColor: "bg-blue-500",
      },

      {
        to: "/high-cost",
        label: "High Cost Inventory",
        icon: Package,
        indicatorColor: "bg-orange-500",
      },

      {
        to: "/low-cost",
        label: "Low Cost Inventory",
        icon: Boxes,
        indicatorColor: "bg-purple-500",
      },
    ],
  },

  {
    title: "Workspace",

    items: [
      {
        to: "/report",
        label: "Reports",
        icon: ChartColumnIncreasing,
      },

      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];