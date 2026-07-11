import type { ReactNode } from "react";

type Props = {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
};

export default function StatCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>

          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {icon && (
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
