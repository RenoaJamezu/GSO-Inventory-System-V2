import {
  Boxes,
  Car,
  ChartColumnIncreasing,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  SquareDashedText,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Property & Inventory",
    items: [
      {
        to: "/par",
        label: "PAR Inventory",
        icon: FileText,
      },
      {
        to: "/high-cost",
        label: "High Cost Inventory",
        icon: Package,
      },
      {
        to: "/low-cost",
        label: "Low Cost Inventory",
        icon: Boxes,
      },
      {
        to: "/stock-card",
        label: "Stock Card",
        icon: SquareDashedText,
      },
      {
        to: "/vehicle-record",
        label: "Vehicle Records",
        icon: Car,
      },
    ],
  },

  {
    title: "Administration",
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
