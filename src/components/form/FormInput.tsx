import type { InputHTMLAttributes } from "react";
import { inputClass } from "./styles";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`${inputClass} ${className}`}
    />
  );
}
