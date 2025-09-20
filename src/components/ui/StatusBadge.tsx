import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "accepted" | "expired";
  className?: string;
}

const statusStyles = {
  active: "bg-success-100 text-success-800",
  inactive: "bg-error-100 text-error-800",
  pending: "bg-warning-100 text-warning-800",
  accepted: "bg-success-100 text-success-800",
  expired: "bg-secondary-100 text-secondary-800",
};

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
