import { useEffect, useRef, useState, type ReactNode } from "react";

import { DropdownContext } from "./DropdownContext";

export type DropdownProps = {
  children: ReactNode;
};

export default function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((current) => !current);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (rootRef.current?.contains(target)) return;

      const menu = document.querySelector("[data-dropdown-menu-open='true']");

      if (menu?.contains(target)) return;

      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        close,
        triggerRef,
      }}
    >
      <div ref={rootRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}
