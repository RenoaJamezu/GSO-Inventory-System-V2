import type { TextareaHTMLAttributes } from "react";

import { formControlClass } from "./styles";

export type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function FormTextarea({
  className = "",
  ...props
}: FormTextareaProps) {
  return (
    <textarea
      {...props}
      className={[formControlClass, "resize-y", className].filter(Boolean).join(" ")}
    />
  );
}
