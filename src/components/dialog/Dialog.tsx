import { useEffect, useRef, type ReactNode } from "react";
import { maxWidthClasses } from "./constants";

type DialogProps = {
  open: boolean;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
};

const FOCUSABLE_SELECTOR = `
  a[href],
  button:not([disabled]),
  textarea:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  [tabindex]:not([tabindex="-1"])
`;

export default function Dialog({
  open,
  children,
  maxWidth = "md",
  onClose,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const dialog = dialogRef.current;

    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialog.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!dialogRef.current) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className={`w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl outline-none`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
