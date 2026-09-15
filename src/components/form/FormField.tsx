import type { HTMLAttributes, ReactNode } from "react";

export type FormFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

export default function FormField({
  label,
  htmlFor,
  required = false,
  description,
  error,
  children,
  className = "",
  ...props
}: FormFieldProps) {
  return (
    <div
      {...props}
      className={["space-y-1.5", className].filter(Boolean).join(" ")}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className="
            block text-sm font-medium
            text-slate-700
            dark:text-slate-300
          "
        >
          {label}

          {required && (
            <>
              <span
                className="ml-1 text-red-600 dark:text-red-400"
                aria-hidden="true"
              >
                *
              </span>

              <span className="sr-only">{" (required)"}</span>
            </>
          )}
        </label>
      )}

      {description && (
        <div
          className="
            text-xs leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </div>
      )}

      {children}

      {error && (
        <div
          role="alert"
          className="
            text-xs leading-5
            text-red-600
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}
