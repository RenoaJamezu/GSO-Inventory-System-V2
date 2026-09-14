import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export default function DialogHeader({ title, children }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>

      {children}
    </div>
  );
}
