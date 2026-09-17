import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactElement,
} from "react";

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
  const { isOpen, toggle, triggerRef } = useDropdown();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    triggerRef.current = wrapperRef.current;

    return () => {
      triggerRef.current = null;
    };
  }, [triggerRef]);

  if (!isValidElement(children)) {
    return null;
  }

  const originalOnClick = children.props.onClick;

  return (
    <span ref={wrapperRef} className="inline-flex">
      {cloneElement(children, {
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        onClick: (event: MouseEvent<HTMLElement>) => {
          originalOnClick?.(event);

          if (!event.defaultPrevented) {
            toggle();
          }
        },
      })}
    </span>
  );
}
