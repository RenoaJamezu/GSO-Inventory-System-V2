import type { TextareaHTMLAttributes } from "react";
import { inputClass } from "./styles";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function FormTextarea({ className = "", ...props }: Props) {
  return (
    <textarea
      {...props}
      className={`${inputClass} ${className}`}
    />
  );
}
