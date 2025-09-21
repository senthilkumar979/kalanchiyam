"use client";

import { Document } from "@/types/database";
import { Download, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditDocumentModal } from "../../../components/documents/EditDocumentModal";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { deleteDocument, getDownloadUrl } from "../actions";

interface DownloadActionsProps {
  doc: Document;
  onDocumentUpdate?: () => void;
}

export const DownloadActions = ({
  doc,
  onDocumentUpdate,
}: DownloadActionsProps) => {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDocumentUpdate = () => {
    onDocumentUpdate?.();
  };

  const isDownloading = downloadingIds.has(doc.id);
  const isDeleting = deletingIds.has(doc.id);

  const handleDownload = async () => {
    setDownloadingIds((prev) => new Set(prev).add(doc.id));

    try {
      const downloadUrl = await getDownloadUrl(doc.id);
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = doc.file_name;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Failed to generate download link");
      }
    } catch (error) {
      alert("Download failed");
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(doc.id);
        return newSet;
      });
    }
  };

  const handleDelete = async () => {
    const docId = doc.id;
    if (!confirm("Are you sure you want to delete this doc?")) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(docId));

    try {
      const result = await deleteDocument(docId);
      if (!result.success) {
        alert(result.error || "Delete failed");
      }
    } catch (error) {
      alert("Delete failed");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  return (
    <div className="flex items-center space-x-1 ml-2">
      <Button
        variant="primary"
        size="sm"
        onClick={handleOpenModal}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6"
      >
        <Pencil className="w-3 h-3" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDownload}
        disabled={isDownloading}
        isLoading={isDownloading}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6"
      >
        <Download className="w-3 h-3" />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        isLoading={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-white"
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      <EditDocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        document={doc}
        onDocumentUpdate={handleDocumentUpdate}
      />

      {isDownloading || isDeleting ? <LoadingSpinner /> : null}
    </div>
  );
};
