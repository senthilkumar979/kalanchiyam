import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import TagsInput from "@/components/ui/TagsInput";
import { useAccounts } from "@/hooks/useAccounts";
import { useState } from "react";
import { updateDocumentDetails } from "../../app/documents/actions";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    file_name: string;
    category: string | null;
    owner: string;
  };
  onDocumentUpdate?: () => void;
}

export const EditDocumentModal = ({
  isOpen,
  onClose,
  document,
  onDocumentUpdate,
}: EditDocumentModalProps) => {
  const [editFileName, setEditFileName] = useState(document.file_name);
  const [editTags, setEditTags] = useState(
    document.category ? document.category.split(", ") : []
  );
  const [editOwner, setEditOwner] = useState(document.owner);
  const [isSaving, setIsSaving] = useState(false);
  const { accounts, isLoading: accountsLoading } = useAccounts();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const categoryAsString = editTags.join(", ");
      const result = await updateDocumentDetails(
        document.id,
        editFileName,
        categoryAsString,
        editOwner
      );
      if (result.success) {
        onDocumentUpdate?.();
        onClose();
      } else {
        alert(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setEditFileName(document.file_name);
    setEditTags(document.category ? document.category.split(", ") : []);
    setEditOwner(document.owner);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Document"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Name
          </label>
          <Input
            value={editFileName}
            onChange={(e) => setEditFileName(e.target.value)}
            placeholder="Enter file name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <TagsInput
            value={editTags?.join(", ")}
            onChange={(tags) =>
              setEditTags(tags.split(", ").map((tag) => tag.trim()))
            }
            placeholder="Add a tag..."
            maxTags={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter to add tags. You can add up to 10 tags.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner <span className="text-red-500">*</span>
          </label>
          <select
            value={editOwner}
            onChange={(e) => setEditOwner(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select an owner</option>
            {accounts.map((account) => (
              <option key={account.email_id} value={account.email_id}>
                {account.name || account.email_id}
              </option>
            ))}
          </select>
          {accountsLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading accounts...</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
