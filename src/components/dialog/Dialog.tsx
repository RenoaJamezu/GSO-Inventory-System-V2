import type { ReactNode } from "react";

type DialogProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

const maxWidthClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
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
