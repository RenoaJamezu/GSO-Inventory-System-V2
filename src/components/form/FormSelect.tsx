import type { SelectHTMLAttributes } from "react";

import { formControlClass } from "./styles";

export type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function FormSelect({
  className = "",
  ...props
}: FormSelectProps) {
  return (
    <select
      {...props}
      className={[formControlClass, className].filter(Boolean).join(" ")}
    />
  );
}
