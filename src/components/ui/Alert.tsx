import { cn } from "@/lib/utils";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

const alertStyles = {
  success: "bg-success-50 text-success-800 border-success-200",
  error: "bg-error-50 text-error-800 border-error-200",
  warning: "bg-warning-50 text-warning-800 border-warning-200",
  info: "bg-info-50 text-info-800 border-info-200",
};

export const Alert = ({ type, message, className }: AlertProps) => {
  return (
    <div className={cn("rounded-md p-4 border", alertStyles[type], className)}>
      <p className="text-sm">{message}</p>
    </div>
  );
};
