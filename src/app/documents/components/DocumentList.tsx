"use client";

import { DocumentItem } from "@/components/documents/DocumentItem";
import { Document } from "@/types/database";
import { useState } from "react";
import { deleteDocument, getDownloadUrl } from "../actions";

interface DocumentListProps {
  documents: Document[];
  onDocumentDeleted?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDocumentDeleted,
}) => {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDownload = async (doc: Document) => {
    setDownloadingIds((prev) => new Set(prev).add(doc.id));

    try {
      const downloadUrl = await getDownloadUrl(doc.id);
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = doc.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Failed to generate download link");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed");
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(doc.id);
        return newSet;
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(documentId));

    try {
      const result = await deleteDocument(documentId);
      if (result.success) {
        onDocumentDeleted?.();
      } else {
        alert(result.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Your Documents</h2>
      </div>

      <div className="mb-4 ml-2 mr-2 mt-2 flex flex-row flex-wrap gap-2 items-center justify-center">
        {documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            onDownload={handleDownload}
            onDelete={handleDelete}
            isDownloading={downloadingIds.has(document.id)}
            isDeleting={deletingIds.has(document.id)}
          />
        ))}
      </div>
    </div>
  );
};
