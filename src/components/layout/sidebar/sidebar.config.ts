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

import { PERMISSIONS, type Permission } from "@/features/auth";

export type SidebarItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
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
        permission: PERMISSIONS.DASHBOARD_VIEW,
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
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        to: "/high-cost",
        label: "High Cost Inventory",
        icon: Package,
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        to: "/low-cost",
        label: "Low Cost Inventory",
        icon: Boxes,
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        to: "/stock-card",
        label: "Stock Card",
        icon: SquareDashedText,
        permission: PERMISSIONS.STOCK_CARD_VIEW,
      },
      {
        to: "/vehicle-record",
        label: "Vehicle Records",
        icon: Car,
        permission: PERMISSIONS.VEHICLE_VIEW,
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
        permission: PERMISSIONS.REPORTS_VIEW,
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_MANAGE,
      },
    ],
  },
];
