import type { SelectHTMLAttributes } from "react";

import { inputClass } from "./styles";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function FormSelect({ className = "", ...props }: Props) {
  return <select {...props} className={`${inputClass} ${className}`} />;
}
