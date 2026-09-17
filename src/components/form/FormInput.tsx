import { forwardRef, type InputHTMLAttributes } from "react";

import { formControlClass } from "./styles";

export type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={[formControlClass, className].filter(Boolean).join(" ")}
    />
  ),
);

FormInput.displayName = "FormInput";

export default FormInput;
