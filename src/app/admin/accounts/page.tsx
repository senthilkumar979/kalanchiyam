"use client";

import { AccountForm } from "@/components/forms/AccountForm";
import { useToastContext } from "@/components/providers/ToastProvider";
import { AccountsTable } from "@/components/tables/AccountsTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAccounts } from "@/hooks/useAccounts";

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    addAccount,
    toggleAccountStatus,
    deleteAccount,
  } = useAccounts();

  const { success, error: showError } = useToastContext();

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAccountStatus(id, currentStatus);
      success(
        "Status Updated",
        `Account ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      showError(
        "Update Failed",
        error instanceof Error
          ? error.message
          : "Failed to update account status"
      );
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      success("Account Deleted", "Account deleted successfully!");
    } catch (error) {
      showError(
        "Delete Failed",
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  };

  const handleAddAccount = async (data: { email_id: string }) => {
    try {
      await addAccount(data.email_id);
      success("Account Added", "Account added successfully!");
    } catch (error) {
      showError(
        "Add Account Failed",
        error instanceof Error ? error.message : "Failed to add account"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Account Management
            </h1>
            <p className="mt-2 text-secondary-600">
              Add or remove allowed email addresses and invite new users.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AccountForm onSubmit={handleAddAccount} />

        <AccountsTable
          accounts={accounts}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteAccount}
        />
      </div>
    </div>
  );
}
