"use client";

import { DocumentItem } from "@/components/documents/DocumentItem";
import { Document } from "@/types/database";

interface DocumentListProps {
  documents: Document[];
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 mt-2 flex flex-row flex-wrap gap-3">
        {documents.map((document) => (
          <DocumentItem key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
};
