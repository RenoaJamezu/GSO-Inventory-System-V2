import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export type SidebarHeaderProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SidebarHeader({
  collapsed,
  onToggle,
}: SidebarHeaderProps) {
  const toggleLabel = collapsed ? "Expand navigation" : "Collapse navigation";

  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div
        className={[
          "flex min-h-22 items-center",
          collapsed ? "justify-center px-3" : "gap-3 px-4",
        ].join(" ")}
      >
        <img
          src="/images/sibagat-logo.png"
          alt="Municipality of Sibagat"
          className="h-12 w-12 shrink-0 object-contain"
        />

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Republic of the Philippines
            </p>

            <p className="truncate text-sm font-bold uppercase leading-tight text-emerald-800 dark:text-emerald-400">
              Municipality of Sibagat
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              General Services Office
            </p>
          </div>
        )}
      </div>

      <div
        className={[
          "flex border-t border-slate-100 px-3 py-2",
          "dark:border-slate-800",
          collapsed ? "justify-center" : "justify-end",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onToggle}
          title={toggleLabel}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          className={[
            "flex h-8 w-8 items-center justify-center",
            "rounded-md text-slate-500",
            "transition-colors",
            "hover:bg-slate-100 hover:text-slate-900",
            "dark:text-slate-400",
            "dark:hover:bg-slate-800 dark:hover:text-white",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-emerald-600/30",
          ].join(" ")}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
