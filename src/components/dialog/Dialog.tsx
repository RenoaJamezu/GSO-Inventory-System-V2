import type { ReactNode } from "react";
import { maxWidthClasses } from "./constants";

type DialogProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export default function Dialog({
  open,
  children,
  maxWidth = "md",
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="flex min-h-full items-center justify-center">
        <div
          className={`w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
