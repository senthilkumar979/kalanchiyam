import { Account, Document } from "./database";

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Message Types
export interface Message {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

// Document Upload Types
export interface DocumentUploadResult {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface UploadDocumentFormData {
  file: File;
  category?: string;
}

// Account Management Types
export interface AccountWithActions extends Account {
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

// Dashboard Types
export interface DashboardAccount {
  email_id: string;
  name: string | null;
  avatar_url: string | null;
}

// Document List Types
export interface DocumentListProps {
  documents: Document[];
  onDocumentDeleted?: () => void;
}

export interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}
