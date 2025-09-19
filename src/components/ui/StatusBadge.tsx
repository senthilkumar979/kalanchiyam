import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "accepted" | "expired";
  className?: string;
}

const statusStyles = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  expired: "bg-gray-100 text-gray-800",
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
