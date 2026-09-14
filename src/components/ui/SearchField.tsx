import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchField({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={17}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-slate-400
          dark:text-slate-500
        "
      />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          min-h-10
          w-full
          rounded-md
          border
          border-slate-300
          bg-white
          py-2
          pl-10
          pr-3
          text-sm
          text-slate-900
          outline-none
          transition-colors
          placeholder:text-slate-400

          focus:border-emerald-600
          focus:ring-2
          focus:ring-emerald-600/15

          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-100
          dark:placeholder:text-slate-500

          dark:focus:border-emerald-500
          dark:focus:ring-emerald-500/20
        "
      />
    </div>
  );
}
