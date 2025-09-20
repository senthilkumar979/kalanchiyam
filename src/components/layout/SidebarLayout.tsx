"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";

interface SidebarLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string;
  };
  onSignOut?: () => void;
}

export const SidebarLayout = ({
  children,
  user,
  onSignOut,
}: SidebarLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-2 text-lg font-semibold text-secondary-900 lg:ml-0">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-secondary-700">
                  Welcome, {user.name || "User"}
                </span>
              )}
              {onSignOut && (
                <Button onClick={onSignOut} variant="ghost" size="sm">
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
