import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DialogBody({ children }: Props) {
  return (
    <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
      <div className="space-y-4">{children}</div>
    </div>
  );
}
