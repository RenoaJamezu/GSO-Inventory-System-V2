import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export default function DialogHeader({ title, children }: Props) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <h2 className="text-lg font-semibold">{title}</h2>

      {children}
    </div>
  );
}
