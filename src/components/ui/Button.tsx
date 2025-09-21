import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { themeConfig } from "../../lib/theme-config";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "warning"
    | "tertiary"
    | "green";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const buttonVariants = {
  primary: {
    backgroundColor: themeConfig.primary[500],
  },
  secondary: {
    backgroundColor: themeConfig.secondary[800],
  },
  danger: {
    backgroundColor: themeConfig.error[600],
  },
  ghost: {
    backgroundColor: themeConfig.secondary[100],
  },
  tertiary: {
    backgroundColor: themeConfig.tertiary[600],
  },
  warning: {
    backgroundColor: themeConfig.warning[600],
  },
  green: {
    backgroundColor: themeConfig.success[600],
  },
};

const buttonSizes = {
  sm: "px-3 py-2 h-8 text-sm",
  md: "px-3 py-2 h-10 text-sm",
  lg: "px-4 py-2 h-12 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "sm",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex flex-row gap-2 align-center text-white items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg text-sm text-center cursor-pointer",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        style={buttonVariants[variant]}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
