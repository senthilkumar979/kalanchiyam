import { cn } from "@/lib/utils";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

const alertStyles = {
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

export const Alert = ({ type, message, className }: AlertProps) => {
  return (
    <div className={cn("rounded-md p-4 border", alertStyles[type], className)}>
      <p className="text-sm">{message}</p>
    </div>
  );
};
