import type { InputHTMLAttributes, ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
};

export default function FormCheckbox({
  label,
  description,
  className = "",
  ...props
}: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        {...props}
        className={[
          "mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600",
          "focus:ring-emerald-500",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {(label || description) && (
        <div>
          {label && <p className="font-medium text-gray-900">{label}</p>}

          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}
