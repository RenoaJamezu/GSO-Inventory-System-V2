import { cloneElement, isValidElement } from "react";
import type { MouseEvent, ReactElement } from "react";

import { useDropdown } from "./DropdownContext";

type TriggerElementProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
};

export type DropdownTriggerProps = {
  children: ReactElement<TriggerElementProps>;
};

export default function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { isOpen, toggle } = useDropdown();

  if (!isValidElement(children)) {
    return null;
  }

  const originalOnClick = children.props.onClick;

  return cloneElement(children, {
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,

    onClick: (event: MouseEvent<HTMLElement>) => {
      originalOnClick?.(event);

      if (!event.defaultPrevented) {
        toggle();
      }
    },
  });
}
