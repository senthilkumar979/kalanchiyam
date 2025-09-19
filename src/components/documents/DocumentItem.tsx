import { useState } from "react";
import { Document } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DocumentItemProps {
  document: Document;
  onDownload: (document: Document) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  onUpdateCategory: (documentId: string, category: string) => Promise<void>;
  isDownloading?: boolean;
  isDeleting?: boolean;
}

export const DocumentItem = ({
  document,
  onDownload,
  onDelete,
  onUpdateCategory,
  isDownloading = false,
  isDeleting = false,
}: DocumentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState(document.category || "");

  const handleSaveCategory = async () => {
    await onUpdateCategory(document.id, editCategory);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditCategory(document.category || "");
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {document.file_name}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(document.file_size)}</span>
                <span>{formatDate(document.uploaded_at)}</span>
                {document.mime_type && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {document.mime_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                  className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  size="sm"
                  onClick={handleSaveCategory}
                  className="text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {document.category ? (
                  <StatusBadge status="active" className="text-xs">
                    {document.category}
                  </StatusBadge>
                ) : (
                  <span className="text-xs text-gray-400">No category</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownload(document)}
            disabled={isDownloading}
            isLoading={isDownloading}
          >
            Download
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(document.id)}
            disabled={isDeleting}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
