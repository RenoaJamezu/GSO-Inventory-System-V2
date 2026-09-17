import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  value: string;
  options: FormSelectOption[];

  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;

  onChange: (value: string) => void;
}

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

const MENU_MAX_HEIGHT = 240;
const MENU_GAP = 6;
const VIEWPORT_PADDING = 16;

export default function FormSelect({
  value,
  options,
  placeholder = "Select option",
  disabled = false,
  name,
  id,
  className = "",
  onChange,
}: FormSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const trigger = triggerRef.current;

    if (!trigger) return;

    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect();

      const spaceBelow =
        window.innerHeight - rect.bottom - VIEWPORT_PADDING - MENU_GAP;

      const spaceAbove = rect.top - VIEWPORT_PADDING - MENU_GAP;

      const desiredHeight = Math.min(MENU_MAX_HEIGHT, options.length * 42 + 8);

      const shouldOpenUpward =
        spaceBelow < desiredHeight && spaceAbove > spaceBelow;

      const nextPlacement = shouldOpenUpward ? "top" : "bottom";

      const availableSpace =
        nextPlacement === "bottom" ? spaceBelow : spaceAbove;

      const maxHeight = Math.max(80, Math.min(MENU_MAX_HEIGHT, availableSpace));

      const top =
        nextPlacement === "bottom"
          ? rect.bottom + MENU_GAP
          : rect.top - MENU_GAP - maxHeight;

      setMenuPosition({
        top,
        left: rect.left,
        width: rect.width,
        maxHeight,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedTrigger = rootRef.current?.contains(target);

      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (option: FormSelectOption) => {
    if (option.disabled) return;

    onChange(option.value);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      if (!disabled) {
        setIsOpen(true);
      }
    }
  };

  const menu =
    isOpen && !disabled && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-labelledby={selectId}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
            }}
            className={[
              "z-100",
              "overflow-y-auto",
              "rounded-md border py-1",
              "border-slate-200",
              "bg-white shadow-lg",

              "dark:border-slate-700",
              "dark:bg-slate-900",
              "dark:shadow-black/30",
            ].join(" ")}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={[
                    "flex w-full",
                    "items-center justify-between gap-3",
                    "px-3 py-2.5",
                    "text-left text-sm",
                    "transition-colors",

                    "focus-visible:outline-none",
                    "focus-visible:bg-slate-100",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",

                    "dark:focus-visible:bg-slate-800",

                    isSelected
                      ? [
                          "bg-emerald-50",
                          "text-emerald-800",
                          "dark:bg-emerald-950/40",
                          "dark:text-emerald-300",
                        ].join(" ")
                      : [
                          "text-slate-700",
                          "hover:bg-slate-50",
                          "dark:text-slate-300",
                          "dark:hover:bg-slate-800",
                          "dark:hover:text-white",
                        ].join(" "),
                  ].join(" ")}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>

                  {isSelected && (
                    <Check size={16} aria-hidden="true" className="shrink-0" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={rootRef}
        className={["relative w-full", className].filter(Boolean).join(" ")}
      >
        {name && <input type="hidden" name={name} value={value} />}

        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => {
            if (!disabled) {
              setIsOpen((current) => !current);
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          className={[
            "flex min-h-10 w-full",
            "items-center justify-between gap-3",
            "rounded-md border",
            "border-slate-300 bg-white",
            "px-3 py-2",
            "text-left text-sm",
            "outline-none",
            "transition-colors",

            "focus:border-emerald-600",
            "focus:ring-2",
            "focus:ring-emerald-600/15",

            "disabled:cursor-not-allowed",
            "disabled:bg-slate-100",
            "disabled:text-slate-500",

            "dark:border-slate-700",
            "dark:bg-slate-900",
            "dark:focus:border-emerald-500",
            "dark:focus:ring-emerald-500/20",

            "dark:disabled:bg-slate-800",
            "dark:disabled:text-slate-500",
          ].join(" ")}
        >
          <span
            className={[
              "min-w-0 flex-1 truncate",
              selectedOption
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-400 dark:text-slate-500",
            ].join(" ")}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={[
              "shrink-0 text-slate-400",
              "transition-transform duration-150",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {menu}
    </>
  );
}
