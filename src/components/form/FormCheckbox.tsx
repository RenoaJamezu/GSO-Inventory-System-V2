import type { InputHTMLAttributes, ReactNode } from "react";

type ColorTheme = "emerald" | "blue" | "orange" | "purple" | "gray";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  colorTheme?: ColorTheme;
};

const themes = {
  emerald: {
    activeCard: "border-emerald-500 bg-emerald-50",
    inactiveCard:
      "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30",
    iconActive: "bg-emerald-100 text-emerald-700",
    iconInactive: "bg-gray-100 text-gray-500",
    checkbox: "text-emerald-600 focus:ring-emerald-500",
  },

  blue: {
    activeCard: "border-blue-500 bg-blue-50",
    inactiveCard:
      "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30",
    iconActive: "bg-blue-100 text-blue-700",
    iconInactive: "bg-gray-100 text-gray-500",
    checkbox: "text-blue-600 focus:ring-blue-500",
  },

  orange: {
    activeCard: "border-orange-500 bg-orange-50",
    inactiveCard:
      "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30",
    iconActive: "bg-orange-100 text-orange-700",
    iconInactive: "bg-gray-100 text-gray-500",
    checkbox: "text-orange-600 focus:ring-orange-500",
  },

  purple: {
    activeCard: "border-purple-500 bg-purple-50",
    inactiveCard:
      "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/30",
    iconActive: "bg-purple-100 text-purple-700",
    iconInactive: "bg-gray-100 text-gray-500",
    checkbox: "text-purple-600 focus:ring-purple-500",
  },

  gray: {
    activeCard: "border-gray-500 bg-gray-100",
    inactiveCard:
      "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-100",
    iconActive: "bg-gray-200 text-gray-700",
    iconInactive: "bg-gray-100 text-gray-500",
    checkbox: "text-gray-600 focus:ring-gray-500",
  },
} satisfies Record<ColorTheme, Record<string, string>>;

export default function FormCheckbox({
  label,
  description,
  icon,
  colorTheme = "emerald",
  className = "",
  checked,
  ...props
}: Props) {
  const active = Boolean(checked);

  const theme = themes[colorTheme];

  return (
    <label
      className={[
        "flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all duration-200",
        active ? theme.activeCard : theme.inactiveCard,
      ].join(" ")}
    >
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between">
          {icon && (
            <div
              className={[
                "rounded-lg p-2 transition-colors",
                active ? theme.iconActive : theme.iconInactive,
              ].join(" ")}
            >
              {icon}
            </div>
          )}

          <input
            type="checkbox"
            checked={checked}
            {...props}
            className={[
              "h-5 w-5 rounded border-gray-300",
              theme.checkbox,
              className,
            ].join(" ")}
          />
        </div>

        <div>
          <p className="font-bold text-gray-900">{label}</p>

          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </label>
  );
}
