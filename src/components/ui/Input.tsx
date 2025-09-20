import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "appearance-none block w-full px-3 py-2 border rounded-md placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm",
            error
              ? "border-error-300 focus:ring-error-500 focus:border-error-500"
              : "border-secondary-300 focus:ring-primary-500 focus:border-primary-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-error-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
