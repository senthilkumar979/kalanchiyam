"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Navigation } from "@/components/layout/Navigation";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { account, isLoading, handleSignOut } = useAuth();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation
        title="Kalanchiyam"
        user={
          account
            ? { name: account.full_name, email: account.email_id }
            : undefined
        }
        onSignOut={handleSignOut}
      />

      <ContentContainer>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Kalanchiyam
            </h2>
            <p className="text-gray-600 mb-8">
              Your personal finance and document management app
            </p>

            <DashboardGrid />
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
