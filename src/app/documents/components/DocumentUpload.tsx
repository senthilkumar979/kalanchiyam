"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsDrawerOpen(false);
    onUploadSuccess?.();
  };

  return (
    <>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Upload Document
      </Button>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Upload Document"
        size="xl"
      >
        <DocumentUploadForm onUploadSuccess={handleUploadSuccess} />
      </Drawer>
    </>
  );
}
