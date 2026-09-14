import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DialogBody({ children }: Props) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
      {children}
    </div>
  );
}
