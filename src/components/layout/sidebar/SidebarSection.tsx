import { usePermissions } from "@/features/auth";

import SidebarItem from "./SidebarItem";

import type { SidebarSectionConfig } from "./types";

export type SidebarSectionProps = {
  section: SidebarSectionConfig;
  collapsed: boolean;
};

export default function SidebarSection({
  section,
  collapsed,
}: SidebarSectionProps) {
  const { can } = usePermissions();

  const visibleItems = section.items.filter(
    (item) => !item.permission || can(item.permission),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section>
      {section.title && !collapsed && (
        <h2 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          {section.title}
        </h2>
      )}

      <div className="space-y-1">
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </div>
    </section>
  );
}
