import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SidebarHeader({ collapsed, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
      <div
        className={[
          "overflow-hidden transition-all duration-300",
          collapsed ? "w-0 opacity-0" : "w-full opacity-100",
        ].join(" ")}
      >
        <h1 className="whitespace-nowrap text-lg font-bold text-green-700">
          Municipality of Sibagat
        </h1>

        <p className="whitespace-nowrap text-sm text-gray-500">
          General Services Office
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>
    </div>
  );
}
