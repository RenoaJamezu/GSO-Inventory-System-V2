import type { InputHTMLAttributes } from "react";

import { formControlClass } from "./styles";

export type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({
  className = "",
  ...props
}: FormInputProps) {
  return (
    <input
      {...props}
      className={[formControlClass, className].filter(Boolean).join(" ")}
    />
  );
}
