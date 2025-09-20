import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Account } from "@/types/database";
import {
  Calendar,
  CircleCheck,
  Mail,
  Power,
  Settings,
  Trash2,
} from "lucide-react";
import { themeConfig } from "../../lib/theme-config";

interface AccountsTableProps {
  accounts: Account[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const AccountsTable = ({
  accounts,
  onToggleStatus,
  onDelete,
}: AccountsTableProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-500">No accounts found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {isMobile ? (
        <div className="flex flex-col space-y-4 p-4">
          {accounts.map((account) => (
            <div key={account.email_id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-lg font-bold">{account.email_id}</h5>
                  <StatusBadge
                    status={account.is_active ? "active" : "inactive"}
                  />
                  <p className="text-secondary-500">
                    {new Date(account.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() =>
                      onToggleStatus(account.email_id, account.is_active)
                    }
                  >
                    {account.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(account.email_id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full rounded-t-lg">
            <thead
              className="bg-secondary-50 rounded-t-lg"
              style={{ backgroundColor: themeConfig.primary[500] }}
            >
              <tr className="text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <CircleCheck size={14} /> Status
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> Created
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                  <div className="flex items-center gap-2">
                    <Settings size={14} /> Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {accounts.map((account) => (
                <tr key={account.email_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {account.email_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={account.is_active ? "active" : "inactive"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(account.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        onToggleStatus(account.email_id, account.is_active)
                      }
                    >
                      {account.is_active ? (
                        <>
                          <Power size={14} /> Deactivate
                        </>
                      ) : (
                        <>
                          <Power size={14} /> Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(account.email_id)}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
