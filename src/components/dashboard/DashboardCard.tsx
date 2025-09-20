import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  href?: string;
  isComingSoon?: boolean;
  className?: string;
}

export const DashboardCard = ({
  title,
  description,
  href,
  isComingSoon = false,
  className = "",
}: DashboardCardProps) => {
  const cardContent = (
    <div
      className={`p-6 rounded-lg shadow hover:shadow-md transition-shadow ${className}`}
    >
      <h3 className="text-lg font-medium text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 text-sm">{description}</p>
    </div>
  );

  if (isComingSoon || !href) {
    return cardContent;
  }

  return <Link href={href}>{cardContent}</Link>;
};
