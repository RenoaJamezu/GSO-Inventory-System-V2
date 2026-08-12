import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  dotColor?: string;
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};
