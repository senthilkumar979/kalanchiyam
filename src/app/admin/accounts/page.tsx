"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Navigation } from "@/components/layout/Navigation";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { AccountForm } from "@/components/forms/AccountForm";
import { AccountsTable } from "@/components/tables/AccountsTable";
import { useAccounts } from "@/hooks/useAccounts";

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    message,
    setMessage,
    addAccount,
    toggleAccountStatus,
    deleteAccount,
  } = useAccounts();

  const handleAddAccount = async (data: { email_id: string }) => {
    await addAccount(data.email_id);
  };

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
        title="Account Management"
        showBackButton
        backHref="/dashboard"
        backText="Back to Dashboard"
      />

      <ContentContainer>
        <AccountForm onSubmit={handleAddAccount} />

        {message && (
          <Alert
            type={message.type}
            message={message.text}
            className="mb-6"
          />
        )}

        <AccountsTable
          accounts={accounts}
          onToggleStatus={toggleAccountStatus}
          onDelete={deleteAccount}
        />
      </ContentContainer>
    </PageContainer>
  );
}
