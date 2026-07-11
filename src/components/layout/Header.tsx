import { Menu, Bell } from "lucide-react";

type HeaderProps = {
  title: string;
  onMenuClick?: () => void;
};

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-24.5 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button (future) */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

          <p className="text-sm text-gray-500">General Services Office</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 transition hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Administrator</p>

            <p className="text-xs text-gray-500">GSO Inventory</p>
          </div>
        </div>
      </div>
    </header>
  );
}
