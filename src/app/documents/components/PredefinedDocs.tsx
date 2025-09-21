"use client";

import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { PredefinedDocIcon } from "../../../components/icons/FileIcon";

interface DocFile {
  id: string;
  name: string;
  file: File | null;
}

export const PredefinedDocs = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const docsList = [
    "Passport",
    "National ID",
    "Voter ID",
    "Driving License",
    "Bank Passbook",
    "Ration Card",
    "PAN Card",
    "Birth Certificate",
    "Marriage Certificate",
    "X Marksheet",
    "XII Marksheet",
    "College Degree",
    "College Marksheet",
  ];

  const [docFiles, setDocFiles] = useState<DocFile[]>(
    docsList.map((doc) => ({
      id: doc.toLowerCase().replace(/\s+/g, "-"),
      name: doc,
      file: null,
    }))
  );

  const handleFileChange = (docId: string, file: File | null) => {
    setDocFiles((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, file } : doc))
    );
  };

  const handleDelete = (docId: string) => {
    setDocFiles((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, file: null } : doc))
    );
  };

  const handleUploadAll = () => {
    const filesToUpload = docFiles.filter((doc) => doc.file);

    if (filesToUpload.length === 0) {
      console.log("No files selected for upload");
      return;
    }

    // Handle bulk upload logic here
    // You can implement the actual upload logic based on your requirements
    filesToUpload.forEach((doc) => {
      if (doc.file) {
        console.log(`Uploading ${doc.name}:`, doc.file);
      }
    });
  };

  const hasSelectedFiles = docFiles.some((doc) => doc.file);

  return (
    <>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2"
        variant="green"
      >
        <Upload className="w-5 h-5" />
        Upload Predefined Docs
      </Button>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Predefined Documents"
        size="xl"
        className="pb-0"
      >
        <h6 className="text-sm text-gray-800 mb-4">
          This is a list of predefined documents that you can upload to your
          account.
        </h6>
        <div className="space-y-4 mb-4">
          {docFiles.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                doc.file ? "border-green-300 bg-green-50" : "border-gray-200"
              }`}
            >
              {/* Document Icon */}
              <div className="flex-shrink-0">
                <PredefinedDocIcon fileName={doc.name} />
              </div>

              {/* Document Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.name}
                </p>
                {doc.file && (
                  <p className="text-xs text-green-600 truncate">
                    Selected: {doc.file.name}
                  </p>
                )}
              </div>

              {/* File Upload Input - Only show when no file is selected */}
              {!doc.file && (
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(doc.id, file);
                    }}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Spacer when file is selected to maintain layout */}
              {doc.file && <div className="flex-1" />}

              {/* Delete Button */}
              {doc.file && (
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(doc.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload All Button - Only show when files are selected */}
        {hasSelectedFiles && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 mb-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Ready to Upload
                </h3>
                <p className="text-xs text-gray-500">
                  {docFiles.filter((doc) => doc.file).length} document(s)
                  selected
                </p>
              </div>
              <Button
                onClick={handleUploadAll}
                className="flex items-center gap-2"
                size="md"
              >
                <Upload className="w-4 h-4" />
                Upload All ({docFiles.filter((doc) => doc.file).length})
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
