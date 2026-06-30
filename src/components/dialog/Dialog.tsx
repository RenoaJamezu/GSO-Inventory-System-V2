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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`w-full rounded-lg bg-white shadow-xl ${maxWidthClasses[maxWidth]}`}
      >
        {children}
      </div>
    </div>
  );
}
