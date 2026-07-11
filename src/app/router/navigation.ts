import { Boxes, FileText, LayoutDashboard } from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
};

export const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Inventory Accounts",
    path: "/inventory-accounts",
    icon: Boxes,
  },

  {
    label: "PPE Summary",
    path: "/reports/ppe-summary",
    icon: FileText,
  },
];
