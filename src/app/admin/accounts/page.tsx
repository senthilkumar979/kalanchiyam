"use client";

import { AccountForm } from "@/components/forms/AccountForm";
import { EditAccountModal } from "@/components/modals/EditAccountModal";
import { useToastContext } from "@/components/providers/ToastProvider";
import { AccountsTable } from "@/components/tables/AccountsTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAccounts } from "@/hooks/useAccounts";
import { Account } from "@/types/database";
import { EditAccountFormData } from "@/types/forms";
import { useState } from "react";

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    addAccount,
    updateAccount,
    toggleAccountStatus,
    deleteAccount,
  } = useAccounts();

  const { success, error: showError } = useToastContext();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = async (data: EditAccountFormData) => {
    try {
      await updateAccount(data);
      success("Account Updated", "Account updated successfully!");
      setIsEditModalOpen(false);
      setEditingAccount(null);
    } catch (error) {
      showError(
        "Update Failed",
        error instanceof Error ? error.message : "Failed to update account"
      );
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAccount(null);
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
          onEdit={handleEditAccount}
        />
      </div>

      {/* Edit Account Modal */}
      {editingAccount && (
        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateAccount}
          account={editingAccount}
        />
      )}
    </div>
  );
}
