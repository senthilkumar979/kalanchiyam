import { uploadDocument } from "@/app/documents/actions";
import { FileTypeIcon } from "@/components/icons/FileTypeIcon";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import TagsInput from "@/components/ui/TagsInput";
import { useAccounts } from "@/hooks/useAccounts";
import { Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  tags: string[];
  owner: string;
  isUploading: boolean;
  uploadError?: string;
}

interface DocumentUploadFormProps {
  onUploadSuccess?: () => void;
}

export const DocumentUploadForm = ({
  onUploadSuccess,
}: DocumentUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accounts, isLoading: accountsLoading } = useAccounts();

  useEffect(() => {
    return () => {
      setFiles([]);
      setUploadError(null);
      setUploadSuccess(false);
      const currentRef = fileInputRef.current;
      if (currentRef) {
        currentRef.value = "";
      }
      setIsUploading(false);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles: DocumentFile[] = selectedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name.split(".")[0],
        tags: [],
        owner: selectedOwner,
        isUploading: false,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      setUploadError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const updateFile = (id: string, updates: Partial<DocumentFile>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const uploadAllFiles = async () => {
    if (files.length === 0) return;
    if (!selectedOwner) {
      setUploadError("Please select an owner for the documents");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    let successCount = 0;
    let errorCount = 0;

    for (const fileData of files) {
      updateFile(fileData.id, { isUploading: true, uploadError: undefined });

      try {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("category", fileData.tags.join(", "));
        formData.append("customName", fileData.name);
        formData.append("owner", selectedOwner);

        const result = await uploadDocument(formData);

        if (result.success) {
          successCount++;
          updateFile(fileData.id, { isUploading: false });
        } else {
          errorCount++;
          updateFile(fileData.id, {
            isUploading: false,
            uploadError: result.error || "Upload failed",
          });
        }
      } catch {
        errorCount++;
        updateFile(fileData.id, {
          isUploading: false,
          uploadError: "Upload failed",
        });
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      setUploadSuccess(true);
      onUploadSuccess?.();
      setTimeout(() => {
        setUploadSuccess(false);
        setFiles([]);
      }, 3000);
    }

    if (errorCount > 0) {
      setUploadError(`${errorCount} file(s) failed to upload`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            name="files"
            onChange={handleFileChange}
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="*/*"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum file size: 10MB each
                </p>
              </div>
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <Plus className="w-4 h-4" />
                <span>Add files</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Selection */}
      <div className="flex-shrink-0 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
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
      </div>

      {files.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                File Name
              </label>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Tags</label>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Owner</label>
            </div>
            <div className="w-16"></div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <FileTypeIcon
                  fileName={fileData.file.name}
                  className="w-5 h-5 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={fileData.name}
                      onChange={(e) =>
                        updateFile(fileData.id, { name: e.target.value })
                      }
                      className="text-sm"
                      placeholder="File name"
                    />
                    <div className="flex-1 flex items-center space-x-2">
                      <TagsInput
                        value={fileData.tags.join(", ")}
                        onChange={(value) =>
                          updateFile(fileData.id, {
                            tags: value.split(", ").map((tag) => tag.trim()),
                          })
                        }
                        placeholder="Add tags..."
                        maxTags={3}
                        className="text-sm"
                      />
                    </div>
                    <select
                      value={fileData.owner}
                      onChange={(e) =>
                        updateFile(fileData.id, { owner: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select owner</option>
                      {accounts.map((account) => (
                        <option key={account.email_id} value={account.email_id}>
                          {account.name || account.email_id}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {(fileData.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  {fileData.uploadError && (
                    <p className="text-xs text-red-600">
                      {fileData.uploadError}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {fileData.isUploading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileData.id)}
                    className="p-1 h-8 w-8 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex-shrink-0 pt-4 border-t border-gray-200 mt-4">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFiles([]);
                setUploadError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Clear All
            </Button>
            <Button
              type="button"
              onClick={uploadAllFiles}
              disabled={isUploading || files.some((f) => f.isUploading)}
              isLoading={isUploading}
            >
              Upload {files.length} File{files.length > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      )}

      <div className="flex-shrink-0 mt-4">
        {uploadError && <Alert type="error" message={uploadError} />}
        {uploadSuccess && (
          <Alert type="success" message="Files uploaded successfully!" />
        )}
      </div>
    </div>
  );
};
