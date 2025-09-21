"use client";

import { getDocuments, uploadDocument } from "@/app/documents/actions";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { useAccounts } from "@/hooks/useAccounts";
import { Document } from "@/types/database";
import { Download, Trash2, Upload, User } from "lucide-react";
import React, { useState } from "react";
import { PredefinedDocIcon } from "../../../components/icons/FileIcon";

interface DocFile {
  id: string;
  name: string;
  file: File | null;
  owner: string;
  existingDocument?: Document & {
    owner_account?: {
      name: string | null;
      email_id: string;
    };
  };
}

interface PredefinedDocsProps {
  onUploadSuccess?: () => void;
}

export const PredefinedDocs = ({
  onUploadSuccess,
}: PredefinedDocsProps = {}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { accounts, isLoading: accountsLoading } = useAccounts();

  // Fetch existing identity-docs documents
  const fetchExistingDocuments = async () => {
    console.log("fetching existing documents");
    setIsLoadingDocuments(true);
    try {
      const documents = await getDocuments();
      console.log("documents", documents);
      const identityDocs = documents.filter(
        (doc) => doc.category === "identity-docs"
      );
      console.log("identityDocs", identityDocs);
      setExistingDocuments(identityDocs);
    } catch (error) {
      console.error("Error fetching existing documents:", error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // Static identity documents list - always show all types
  const docsList = React.useMemo(
    () => [
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
    ],
    []
  );

  const [docFiles, setDocFiles] = useState<Record<string, DocFile[]>>({});

  // Fetch existing documents when component mounts
  React.useEffect(() => {
    fetchExistingDocuments();
  }, []);

  // Initialize doc files for each account when accounts and existing documents are loaded
  React.useEffect(() => {
    if (accounts.length > 0 && existingDocuments.length >= 0) {
      console.log("Initializing doc files with:", {
        accounts: accounts.map((a) => a.email_id),
        existingDocuments: existingDocuments.map((d) => ({
          owner: d.owner,
          file_name: d.file_name,
          category: d.category,
        })),
        docsList,
      });

      const initialDocFiles: Record<string, DocFile[]> = {};

      accounts.forEach((account) => {
        initialDocFiles[account.email_id] = docsList.map((docName) => {
          // Find existing document for this account and document name
          // The file_name in DB includes extension, so we need to check if it starts with the docName
          const existingDoc = existingDocuments.find(
            (doc) =>
              doc.owner === account.email_id &&
              (doc.file_name === docName ||
                doc.file_name.startsWith(`${docName}.`))
          );

          console.log(
            `Looking for ${docName} for account ${account.email_id}:`,
            existingDoc
          );

          return {
            id: docName.toLowerCase().replace(/\s+/g, "-"),
            name: docName,
            file: null,
            owner: account.email_id,
            existingDocument: existingDoc,
          };
        });
      });

      setDocFiles(initialDocFiles);
      // Set first account as selected by default
      if (!selectedAccount) {
        setSelectedAccount(accounts[0].email_id);
      }
    }
  }, [accounts, existingDocuments, selectedAccount, docsList]);

  const handleFileChange = (docId: string, file: File | null) => {
    if (!selectedAccount) return;

    setDocFiles((prev) => ({
      ...prev,
      [selectedAccount]:
        prev[selectedAccount]?.map((doc) =>
          doc.id === docId ? { ...doc, file } : doc
        ) || [],
    }));
  };

  const handleDelete = async (docId: string) => {
    if (!selectedAccount) return;

    const currentAccountDocs = docFiles[selectedAccount] || [];
    const docToDelete = currentAccountDocs.find((doc) => doc.id === docId);

    if (!docToDelete) return;

    // If it's an existing document, we need to delete it from the database
    if (docToDelete.existingDocument) {
      try {
        const response = await fetch("/api/delete-document", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: docToDelete.existingDocument.id }),
        });

        if (response.ok) {
          // Refresh existing documents to update the UI
          await fetchExistingDocuments();
          // Call the success callback to refresh the documents list
          onUploadSuccess?.();
        } else {
          console.error("Failed to delete document from database");
        }
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    } else {
      // If it's just a new file selection, just clear it
      setDocFiles((prev) => ({
        ...prev,
        [selectedAccount]:
          prev[selectedAccount]?.map((doc) =>
            doc.id === docId ? { ...doc, file: null } : doc
          ) || [],
      }));
    }
  };

  const handleDownload = async (existingDoc: Document) => {
    try {
      // Create a download link for the file
      const response = await fetch(
        `/api/download-document?id=${existingDoc.id}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = existingDoc.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Download failed");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleUploadAll = async () => {
    if (!selectedAccount) return;

    const currentAccountDocs = docFiles[selectedAccount] || [];
    const filesToUpload = currentAccountDocs.filter((doc) => doc.file);

    if (filesToUpload.length === 0) {
      console.log("No files selected for upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of filesToUpload) {
      if (!doc.file) continue;

      try {
        const formData = new FormData();
        formData.append("file", doc.file);
        formData.append("category", "identity-docs"); // Fixed category for identity docs
        formData.append("customName", doc.name); // Use identity doc name as custom name
        formData.append("owner", selectedAccount);

        const result = await uploadDocument(formData);

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to upload ${doc.name}:`, result.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error uploading ${doc.name}:`, error);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      setUploadSuccess(true);
      // Clear the selected files after successful upload
      setDocFiles((prev) => ({
        ...prev,
        [selectedAccount]:
          prev[selectedAccount]?.map((doc) => ({
            ...doc,
            file: null,
          })) || [],
      }));
      // Refresh existing documents to update the UI
      await fetchExistingDocuments();
      // Call the success callback to refresh the documents list
      onUploadSuccess?.();
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    }

    if (errorCount > 0) {
      setUploadError(`${errorCount} file(s) failed to upload`);
      // Clear error message after 5 seconds
      setTimeout(() => setUploadError(null), 5000);
    }
  };

  const currentAccountDocs = selectedAccount
    ? docFiles[selectedAccount] || []
    : [];
  const hasSelectedFiles = currentAccountDocs.some((doc) => doc.file);

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
        size="2xl"
        className="pb-0"
      >
        {/* Only show helper text and tabs if there are multiple accounts */}
        {accounts.length > 1 && (
          <>
            {/* Account Tabs */}
            {accountsLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-sm text-gray-500">Loading accounts...</div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {accounts.map((account) => (
                      <button
                        key={account.email_id}
                        onClick={() => setSelectedAccount(account.email_id)}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                          selectedAccount === account.email_id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {account.avatar_url ? (
                          <img
                            src={account.avatar_url}
                            className="w-10 h-10 rounded-full"
                            alt={account.name || account.email_id}
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        {account.name || account.email_id}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </>
        )}

        {/* Upload Status Messages */}
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Documents uploaded successfully!
            </p>
          </div>
        )}
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{uploadError}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingDocuments && (
          <div className="flex justify-center py-8">
            <div className="text-sm text-gray-500">
              Loading identity documents...
            </div>
          </div>
        )}

        {/* Documents List for Selected Account */}
        {selectedAccount && !isLoadingDocuments && (
          <div className="space-y-4 mb-4">
            {/* Only show account-specific helper text if there are multiple accounts */}
            {accounts.length > 1 && (
              <h6 className="text-sm text-gray-800 mb-4">
                You see the list of identity documents for{" "}
                <strong>
                  {accounts.find((acc) => acc.email_id === selectedAccount)
                    ?.name || selectedAccount}
                </strong>
                .
              </h6>
            )}
            {currentAccountDocs.map((doc) => {
              const hasExistingDoc = !!doc.existingDocument;
              const hasNewFile = !!doc.file;

              return (
                <div
                  key={doc.id}
                  className={`relative flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    hasNewFile
                      ? "border-green-300 bg-green-50"
                      : hasExistingDoc
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* Document Icon */}
                  <div className="flex-shrink-0">
                    <PredefinedDocIcon fileName={doc.name} />
                  </div>

                  {/* Document Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.name}
                      </p>
                      {hasExistingDoc && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Already Uploaded
                        </span>
                      )}
                    </div>
                    {hasNewFile && (
                      <p className="text-xs text-green-600 truncate">
                        New file: {doc.file?.name}
                      </p>
                    )}
                  </div>

                  {/* File Upload Input - Only show when no file exists */}
                  {!hasExistingDoc && !hasNewFile && (
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

                  {/* Spacer when file exists to maintain layout */}
                  {(hasExistingDoc || hasNewFile) && <div className="flex-1" />}

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {/* Download Button - Only show for existing documents */}
                    {hasExistingDoc && !hasNewFile && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(doc.existingDocument!)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Delete Button - Show for both existing and new files */}
                    {(hasNewFile || hasExistingDoc) && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center gap-2"
                        title={
                          hasExistingDoc
                            ? "Delete document"
                            : "Remove selected file"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload All Button - Only show when files are selected */}
        {hasSelectedFiles && selectedAccount && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 mb-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Ready to Upload
                </h3>
                <p className="text-xs text-gray-500">
                  {currentAccountDocs.filter((doc) => doc.file).length}{" "}
                  document(s){" "}
                  {accounts.length > 1
                    ? `selected for ${
                        accounts.find((acc) => acc.email_id === selectedAccount)
                          ?.name || selectedAccount
                      }`
                    : "selected"}
                </p>
              </div>
              <Button
                onClick={handleUploadAll}
                className="flex items-center gap-2"
                size="md"
                disabled={isUploading}
                isLoading={isUploading}
              >
                <Upload className="w-4 h-4" />
                {isUploading
                  ? "Uploading..."
                  : `Upload All (${
                      currentAccountDocs.filter((doc) => doc.file).length
                    })`}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
