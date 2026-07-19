import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type ColorTheme = "emerald" | "blue" | "orange" | "purple" | "gray";

type StatCardProps = {
  icon: ReactNode;
  colorTheme?: ColorTheme;
  title: string;
  value: string | number;
  description?: string;
  route?: string;
};

const themes = {
  emerald: {
    card: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-700",
  },

  blue: {
    card: "border-blue-200 bg-blue-50 hover:border-blue-300",
    icon: "bg-blue-100 text-blue-700",
  },

  orange: {
    card: "border-orange-200 bg-orange-50 hover:border-orange-300",
    icon: "bg-orange-100 text-orange-700",
  },

  purple: {
    card: "border-purple-200 bg-purple-50 hover:border-purple-300",
    icon: "bg-purple-100 text-purple-700",
  },

  gray: {
    card: "border-gray-200 bg-gray-50 hover:border-gray-300",
    icon: "bg-gray-200 text-gray-700",
  },
} satisfies Record<ColorTheme, Record<string, string>>;

export default function StatCard({
  icon,
  colorTheme = "emerald",
  title,
  value,
  description,
  route,
}: StatCardProps) {
  const theme = themes[colorTheme];
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (route) navigate(route);
      }}
      className={[
        "rounded-xl border p-6 shadow-sm transition-all duration-200",
        theme.card,
        route
          ? "cursor-pointer hover:shadow-md"
          : "cursor-default",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">{title}</p>

        <div
          className={[
            "rounded-lg p-2 shadow-sm transition-colors",
            theme.icon,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}
