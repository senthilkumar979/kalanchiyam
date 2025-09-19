import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface NavigationProps {
  title: string;
  user?: {
    name?: string | null;
    email?: string;
  };
  onSignOut?: () => void;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
  children?: React.ReactNode;
}

export const Navigation = ({
  title,
  user,
  onSignOut,
  showBackButton = false,
  backHref = "/dashboard",
  backText = "Back to Dashboard",
  children,
}: NavigationProps) => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-gray-900 hover:text-gray-700"
            >
              {title}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-700">
                Welcome, {user.name || "User"}
              </span>
            )}
            {children}
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="secondary" size="sm">
                  {backText}
                </Button>
              </Link>
            )}
            {onSignOut && (
              <Button onClick={onSignOut} variant="secondary" size="sm">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
