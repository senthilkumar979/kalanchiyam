import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { uploadDocument } from "@/app/documents/actions";

interface DocumentUploadFormProps {
  onUploadSuccess?: () => void;
}

export const DocumentUploadForm = ({ onUploadSuccess }: DocumentUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const result = await uploadDocument(formData);

      if (result.success) {
        setUploadSuccess(true);
        setCategory("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess?.();

        // Reset success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || "Upload failed");
      }
    } catch (error) {
      setUploadError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Auto-suggest category based on file type
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (["pdf"].includes(extension || "")) {
        setCategory("Documents");
      } else if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        setCategory("Images");
      } else if (["xlsx", "xls", "csv"].includes(extension || "")) {
        setCategory("Spreadsheets");
      } else if (["docx", "doc"].includes(extension || "")) {
        setCategory("Word Documents");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>

      <form action={handleSubmit} className="space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          name="file"
          onChange={handleFileChange}
          helperText="Maximum file size: 10MB"
          required
        />

        <Input
          type="text"
          name="category"
          label="Category (Optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Documents, Images, Receipts"
        />

        <Button
          type="submit"
          disabled={isUploading}
          isLoading={isUploading}
          className="w-full"
        >
          Upload Document
        </Button>
      </form>

      {uploadError && (
        <Alert type="error" message={uploadError} className="mt-4" />
      )}

      {uploadSuccess && (
        <Alert type="success" message="Document uploaded successfully!" className="mt-4" />
      )}
    </div>
  );
};
