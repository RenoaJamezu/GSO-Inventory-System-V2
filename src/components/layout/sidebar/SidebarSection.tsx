import SidebarItem from "./SidebarItem";
import type { SidebarSection as SidebarSectionType } from "./sidebar.config";

type Props = {
  section: SidebarSectionType;
  collapsed: boolean;
};

export default function SidebarSection({ section, collapsed }: Props) {
  return (
    <div className="space-y-2">
      {section.title && (
        <h5
          className={[
            "overflow-hidden text-sm font-bold text-gray-500 transition-all duration-300",

            collapsed ? "h-0 opacity-0" : "h-auto opacity-100",
          ].join(" ")}
        >
          {section.title}
        </h5>
      )}

      <div className="space-y-2">
        {section.items.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            indicatorColor={item.indicatorColor}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}
