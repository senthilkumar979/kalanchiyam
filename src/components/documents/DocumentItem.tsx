import { FileTypeIcon } from "@/components/icons/FileTypeIcon";
import { Document } from "@/types/database";
import { Calendar, HardDrive, Tag, User } from "lucide-react";
import { DownloadActions } from "../../app/documents/components/DownloadActions";
import { formatDate, formatFileType } from "../../lib/utils";

interface DocumentItemProps {
  document: Document & {
    owner_account?: {
      name: string | null;
      email_id: string;
    };
  };
  onDocumentUpdate?: () => void;
}

export const DocumentItem = ({
  document,
  onDocumentUpdate,
}: DocumentItemProps) => {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 w-full max-w-sm">
      <div className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* File Icon */}
            <div className="flex-shrink-0">
              <FileTypeIcon
                fileName={document.file_name}
                className="w-4 h-4 text-white"
              />
            </div>

            {/* File Name */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {document.file_name}
              </h3>
            </div>
          </div>

          {/* Actions */}
          <DownloadActions doc={document} onDocumentUpdate={onDocumentUpdate} />
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <HardDrive className="w-3 h-3" />
              <span>{formatFileSize(document.file_size)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(document.uploaded_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{document.owner_account?.name || document.owner}</span>
            </div>
          </div>
          {document.mime_type && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {formatFileType(document.mime_type)}
            </span>
          )}
        </div>

        {/* Tags Section */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-2">
            <Tag className="w-3 h-3 text-gray-400" />
            {document.category ? (
              <div className="flex flex-wrap gap-1">
                {document.category.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
