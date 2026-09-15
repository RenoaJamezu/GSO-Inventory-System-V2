import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export type SidePanelProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  open: boolean;
  children: ReactNode;
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

export default function SidePanel({
  open,
  children,
  onClose,
  className = "",
  ...props
}: SidePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
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

    const panel = panelRef.current;
    if (!panel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      panel.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentPanel = panelRef.current;
      if (!currentPanel) return;

      if (event.key === "Escape") {
        if (!onCloseRef.current) return;

        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusable =
        currentPanel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (currentFocusable.length === 0) {
        event.preventDefault();
        currentPanel.focus();
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
        fixed inset-0 z-40
        bg-black/30
        dark:bg-black/60
      "
      onClick={handleBackdropClick}
    >
      <aside
        {...props}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={[
          "fixed right-0 top-0 z-50",
          "flex h-screen w-full max-w-lg flex-col",
          "border-l border-slate-200",
          "bg-white shadow-xl",
          "outline-none",
          "dark:border-slate-800",
          "dark:bg-slate-900",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </aside>
    </div>
  );
}
