import SidebarItem from "./SidebarItem";

import type { SidebarSection as SidebarSectionType } from "./sidebar.config";

type Props = {
  section: SidebarSectionType;
  collapsed: boolean;
};

export default function SidebarSection({ section, collapsed }: Props) {
  return (
    <section>
      {section.title && !collapsed && (
        <h2 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          {section.title}
        </h2>
      )}

      <div className="space-y-1">
        {section.items.map((item) => (
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
