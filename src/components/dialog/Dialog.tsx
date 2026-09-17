import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { dialogMaxWidthClasses, type DialogMaxWidth } from "./constants";

export type DialogProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  open: boolean;
  children: ReactNode;
  maxWidth?: DialogMaxWidth;
  onClose?: () => void;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function Dialog({
  open,
  children,
  maxWidth = "md",
  onClose,
  className = "",
  ...props
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const dialog = dialogRef.current;

    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialog.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentDialog = dialogRef.current;

      if (!currentDialog) return;

      if (event.key === "Escape") {
        if (!onCloseRef.current) return;

        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusable =
        currentDialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (currentFocusable.length === 0) {
        event.preventDefault();
        currentDialog.focus();
        return;
      }

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;

      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        overflow-y-auto
        bg-black/30 p-4
        dark:bg-black/60
      "
    >
      <div
        className="
          flex min-h-full
          items-center justify-center
        "
        onClick={handleBackdropClick}
      >
        <div
          {...props}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={[
            "flex max-h-[calc(100vh-2rem)]",
            "w-full flex-col",
            "overflow-hidden rounded-lg border",
            "border-slate-200 bg-white",
            "shadow-xl outline-none",
            "dark:border-slate-800",
            "dark:bg-slate-900",
            dialogMaxWidthClasses[maxWidth],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
