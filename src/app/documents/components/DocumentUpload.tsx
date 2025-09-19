"use client";

import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  return <DocumentUploadForm onUploadSuccess={onUploadSuccess} />;
}
