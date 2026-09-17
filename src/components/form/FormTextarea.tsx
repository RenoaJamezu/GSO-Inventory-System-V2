import { forwardRef, type TextareaHTMLAttributes } from "react";

import { formControlClass } from "./styles";

export type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      {...props}
      className={[formControlClass, className].filter(Boolean).join(" ")}
    />
  ),
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
