import type { LucideIcon } from "lucide-react";

import type { Permission } from "@/features/auth";

export type SidebarItemConfig = {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
};

export type SidebarSectionConfig = {
  title?: string;
  items: SidebarItemConfig[];
};
