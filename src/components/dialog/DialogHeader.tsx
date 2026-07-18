import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export default function DialogHeader({ title, children }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-gray-500 px-6 py-4">
      <h2 className="text-lg font-bold">{title}</h2>

      {children}
    </div>
  );
}
