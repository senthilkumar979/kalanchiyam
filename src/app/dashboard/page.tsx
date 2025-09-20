"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome to Kalanchiyam
          </h1>
          <p className="text-secondary-600 mt-1">
            Your personal finance and document management app
          </p>
        </div>
      </div>

      {/* Empty dashboard content */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Dashboard Coming Soon
          </h3>
          <p className="text-secondary-600 max-w-md mx-auto">
            This is your main dashboard. We&apos;re working on adding
            personalized widgets, quick actions, and insights to help you manage
            your finances and documents.
          </p>
        </div>
      </div>
    </div>
  );
}
