import { DashboardCard } from "./DashboardCard";

const dashboardCards = [
  {
    title: "Invite Users",
    description: "Send invitations to new users",
    href: "/invite-user",
  },
  {
    title: "Manage Accounts",
    description: "Add or remove allowed email addresses",
    href: "/admin/accounts",
  },
  {
    title: "Documents",
    description: "Upload and manage your documents",
    href: "/documents",
  },
  {
    title: "Finances",
    description: "Track your finances (Coming Soon)",
    isComingSoon: true,
  },
];

export const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl">
      {dashboardCards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          description={card.description}
          href={card.href}
          isComingSoon={card.isComingSoon}
          className="bg-white"
        />
      ))}
    </div>
  );
};
