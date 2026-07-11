import type { ReactNode } from "react";

type Props = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function Toolbar({ left, center, right }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">{left}</div>

      {center && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {center}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {right}
      </div>
    </div>
  );
}
