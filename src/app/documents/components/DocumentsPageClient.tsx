"use client";

import { ChooseView } from "./ChooseView";
import { DocumentUpload } from "./DocumentUpload";
import { PredefinedDocs } from "./PredefinedDocs";
import { useRef } from "react";

export const DocumentsPageClient = () => {
  const chooseViewRef = useRef<{ refreshDocuments: () => void }>(null);

  const handleUploadSuccess = () => {
    // Trigger refresh in ChooseView
    if (chooseViewRef.current?.refreshDocuments) {
      chooseViewRef.current.refreshDocuments();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Document Management
            </h1>
            <p className="mt-2 text-secondary-600">
              Upload, organize, and manage your personal documents securely.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <PredefinedDocs onUploadSuccess={handleUploadSuccess} />
            <DocumentUpload />
          </div>
        </div>
      </div>

      <ChooseView ref={chooseViewRef} />
    </div>
  );
};
