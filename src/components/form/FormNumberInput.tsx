import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

import { formControlClass } from "./styles";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
>;

export interface FormNumberInputProps extends NativeInputProps {
  value?: number | null;
  onValueChange?: (value: number | undefined) => void;

  useGrouping?: boolean;
  maximumFractionDigits?: number;
}

function removeGrouping(value: string): string {
  return value.replace(/,/g, "");
}

function sanitizeInput(value: string, maximumFractionDigits: number): string {
  let sanitized = removeGrouping(value);

  sanitized = sanitized.replace(/[^\d.-]/g, "");

  const isNegative = sanitized.startsWith("-");

  sanitized = sanitized.replace(/-/g, "");

  const decimalIndex = sanitized.indexOf(".");

  let integerPart: string;
  let decimalPart: string | undefined;

  if (decimalIndex >= 0) {
    integerPart = sanitized.slice(0, decimalIndex);

    decimalPart = sanitized
      .slice(decimalIndex + 1)
      .replace(/\./g, "")
      .slice(0, maximumFractionDigits);
  } else {
    integerPart = sanitized;
  }

  /*
   * Prevent unnecessary leading zeroes while preserving:
   *
   * 0
   * 0.
   * 0.50
   */
  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+(?=\d)/, "");
  }

  let result = integerPart;

  if (decimalPart !== undefined) {
    result += `.${decimalPart}`;
  }

  if (isNegative) {
    result = `-${result}`;
  }

  return result;
}

function addGrouping(value: string): string {
  if (value === "" || value === "-" || value === "." || value === "-.") {
    return value;
  }

  const isNegative = value.startsWith("-");

  const unsignedValue = isNegative ? value.slice(1) : value;

  const [integerPart = "", decimalPart] = unsignedValue.split(".");

  const groupedInteger =
    integerPart === "" ? "" : integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let result = groupedInteger;

  /*
   * Preserve the decimal point while the user is typing.
   *
   * 1,000.
   * 1,000.5
   */
  if (value.includes(".")) {
    result += `.${decimalPart ?? ""}`;
  }

  if (isNegative) {
    result = `-${result}`;
  }

  return result;
}

function parseNumber(value: string): number | undefined {
  const normalized = removeGrouping(value);

  if (
    normalized === "" ||
    normalized === "-" ||
    normalized === "." ||
    normalized === "-."
  ) {
    return undefined;
  }

  const numericValue = Number(normalized);

  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function formatExternalValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return addGrouping(String(value));
}

export default function FormNumberInput({
  value,
  onValueChange,

  useGrouping = true,
  maximumFractionDigits = 2,

  className = "",
  ...props
}: FormNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = useState(() =>
    useGrouping ? formatExternalValue(value) : (value?.toString() ?? ""),
  );

  const isEditingRef = useRef(false);

  /*
   * Synchronize values coming from outside the component,
   * such as when opening an existing record.
   *
   * Do not overwrite displayValue while the user is typing.
   */
  useEffect(() => {
    if (isEditingRef.current) {
      return;
    }

    setDisplayValue(
      useGrouping ? formatExternalValue(value) : (value?.toString() ?? ""),
    );
  }, [value, useGrouping]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    isEditingRef.current = true;

    const input = event.target;

    const caretPosition = input.selectionStart ?? input.value.length;

    /*
     * Count how many actual numeric characters occur before
     * the caret. Commas don't count because they're only
     * presentation characters.
     */
    const charactersBeforeCaret = input.value
      .slice(0, caretPosition)
      .replace(/,/g, "").length;

    const sanitized = sanitizeInput(input.value, maximumFractionDigits);

    const formatted = useGrouping ? addGrouping(sanitized) : sanitized;

    setDisplayValue(formatted);

    onValueChange?.(parseNumber(sanitized));

    /*
     * React updates the input after this handler.
     * Restore the caret relative to the user's actual digits
     * rather than the commas we inserted.
     */
    requestAnimationFrame(() => {
      const element = inputRef.current;

      if (!element) {
        return;
      }

      let seenCharacters = 0;
      let nextCaretPosition = formatted.length;

      for (let index = 0; index < formatted.length; index += 1) {
        if (formatted[index] !== ",") {
          seenCharacters += 1;
        }

        if (seenCharacters >= charactersBeforeCaret) {
          nextCaretPosition = index + 1;
          break;
        }
      }

      element.setSelectionRange(nextCaretPosition, nextCaretPosition);
    });
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    isEditingRef.current = false;

    props.onBlur?.(event);
  }

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={[formControlClass, "tabular-nums", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
