import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DialogBody({ children }: Props) {
  return <div className="space-y-4 p-6">{children}</div>;
}
