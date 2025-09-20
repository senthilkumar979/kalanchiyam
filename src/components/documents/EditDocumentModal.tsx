import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import TagsInput from "@/components/ui/TagsInput";
import { useState } from "react";
import { updateDocumentDetails } from "../../app/documents/actions";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    file_name: string;
    category: string | null;
  };
}

export const EditDocumentModal = ({
  isOpen,
  onClose,
  document,
}: EditDocumentModalProps) => {
  const [editFileName, setEditFileName] = useState(document.file_name);
  const [editTags, setEditTags] = useState(
    document.category ? document.category.split(", ") : []
  );
  console.log(editFileName);
  console.log(editTags);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const categoryAsString = editTags.join(", ");
      const result = await updateDocumentDetails(
        document.id,
        editFileName,
        categoryAsString
      );
      if (result.success) {
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
