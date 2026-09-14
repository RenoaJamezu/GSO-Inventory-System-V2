import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        )}
      </label>

      {children}
    </div>
  );
}
