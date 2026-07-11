import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DialogFooter({ children }: Props) {
  return (
    <div className="flex justify-end gap-2 border-t border-gray-500 px-6 py-4">{children}</div>
  );
}
