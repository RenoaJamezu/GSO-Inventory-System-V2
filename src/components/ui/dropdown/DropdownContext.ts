import { createContext, useContext, type RefObject } from "react";

export type DropdownContextValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLElement | null>;
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used within <Dropdown>.");
  }

  return context;
}
