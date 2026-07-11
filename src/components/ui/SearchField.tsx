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
    <div className="w-full max-w-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-2
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "
      />
    </div>
  );
}
