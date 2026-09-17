import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useDropdown } from "./DropdownContext";

export type DropdownContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  align?: "start" | "end";
};

export default function DropdownContent({
  children,
  align = "end",
  className = "",
  ...props
}: DropdownContentProps) {
  const { isOpen, close, triggerRef } = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  const [style, setStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    visibility: "hidden",
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;

    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    if (menuRect.width === 0 || menuRect.height === 0) {
      return;
    }

    const viewportPadding = 8;
    const gap = 6;

    let left =
      align === "start" ? triggerRect.left : triggerRect.right - menuRect.width;

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - menuRect.width - viewportPadding),
    );

    const availableBelow =
      window.innerHeight - triggerRect.bottom - viewportPadding;

    const availableAbove = triggerRect.top - viewportPadding;

    const openAbove =
      menuRect.height > availableBelow && availableAbove > availableBelow;

    let top = openAbove
      ? triggerRect.top - menuRect.height - gap
      : triggerRect.bottom + gap;

    top = Math.max(
      viewportPadding,
      Math.min(top, window.innerHeight - menuRect.height - viewportPadding),
    );

    setStyle({
      position: "fixed",
      top,
      left,
      visibility: "visible",
    });
  }, [align, triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePositionChange = () => {
      updatePosition();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("resize", handlePositionChange);
    window.addEventListener("scroll", handlePositionChange, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handlePositionChange);
      window.removeEventListener("scroll", handlePositionChange, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close, triggerRef, updatePosition]);

  if (!isOpen) return null;

  return createPortal(
    <div
      {...props}
      ref={menuRef}
      role="menu"
      data-dropdown-menu-open="true"
      style={{
        ...style,
        ...props.style,
      }}
      className={[
        "z-100 min-w-56",
        "overflow-hidden rounded-md border py-1",
        "border-slate-200 bg-white shadow-lg",
        "dark:border-slate-700",
        "dark:bg-slate-900",
        "dark:shadow-black/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>,
    document.body,
  );
}
