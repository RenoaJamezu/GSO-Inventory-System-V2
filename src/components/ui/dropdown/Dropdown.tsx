import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { DropdownContext, type DropdownContextValue } from "./DropdownContext";

export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
};

export default function Dropdown({
  children,
  className = "",
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      toggle,
      close,
    }),
    [close, isOpen, toggle],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        {...props}
        ref={rootRef}
        className={["relative inline-block", className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}
