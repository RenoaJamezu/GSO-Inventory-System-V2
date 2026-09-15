import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export default function SearchField({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  "aria-label": ariaLabel = "Search",
  ...props
}: SearchFieldProps) {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className="relative w-full">
      <Search
        size={17}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-3 top-1/2
          -translate-y-1/2
          text-slate-400
          dark:text-slate-500
        "
      />

      <input
        {...props}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={[
          "min-h-10 w-full rounded-md border",
          "border-slate-300 bg-white",
          "py-2 pl-10",
          value ? "pr-10" : "pr-3",
          "text-sm text-slate-900",
          "outline-none transition-colors",
          "placeholder:text-slate-400",
          "focus:border-emerald-600",
          "focus:ring-2 focus:ring-emerald-600/15",
          "dark:border-slate-700",
          "dark:bg-slate-900",
          "dark:text-slate-100",
          "dark:placeholder:text-slate-500",
          "dark:focus:border-emerald-500",
          "dark:focus:ring-emerald-500/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute right-2 top-1/2
            flex h-7 w-7 -translate-y-1/2
            items-center justify-center
            rounded-md
            text-slate-400
            transition-colors
            hover:bg-slate-100
            hover:text-slate-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-emerald-600
            dark:text-slate-500
            dark:hover:bg-slate-800
            dark:hover:text-slate-200
            dark:focus-visible:ring-emerald-500
          "
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
