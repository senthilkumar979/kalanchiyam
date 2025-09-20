"use server";

import { createClient } from "@/lib/supabase/server";
import { Document } from "@/types/database";
import { revalidatePath } from "next/cache";

export interface UploadDocumentFormData {
  file: File;
  category?: string;
}

export interface DocumentUploadResult {
  success: boolean;
  document?: Document;
  error?: string;
}

export async function uploadDocument(
  formData: FormData
): Promise<DocumentUploadResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const customName = formData.get("customName") as string;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Generate unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    console.log("fileName", fileName);

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("personal_docs")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get user's email for the foreign key
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user?.email) {
      await supabase.storage.from("personal_docs").remove([uploadData.path]);
      return { success: false, error: "User email not found" };
    }

    // Use custom name if provided, otherwise use original file name
    const finalFileName = customName
      ? `${customName}.${file.name.split(".").pop()}`
      : file.name;

    const insertData = {
      user_email_id: userData.user.email,
      file_name: finalFileName,
      storage_path: uploadData.path,
      file_size: file.size,
      mime_type: file.type,
      category: category || null,
    };

    console.log("insertData", insertData);

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("personal_docs").remove([uploadData.path]);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    revalidatePath("/documents");
    return { success: true, document };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return [];
    }

    return documents || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getDownloadUrl(
  documentId: string
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Get document details
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      return null;
    }

    // Generate pre-signed URL for download
    const { data: urlData, error: urlError } = await supabase.storage
      .from("personal_docs")
      .createSignedUrl(document.storage_path, 3600); // 1 hour expiry

    if (urlError) {
      console.error("Error creating download URL:", urlError);
      return null;
    }

    return urlData.signedUrl;
  } catch (error) {
    console.error("Error creating download URL:", error);
    return null;
  }
}

export async function deleteDocument(
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get document details first
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      return { success: false, error: "Document not found" };
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("personal_docs")
      .remove([document.storage_path]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Don't fail the operation if storage deletion fails
    }

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateDocumentCategory(
  documentId: string,
  category: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    console.log("updateDocumentCategory called with:", {
      documentId,
      category,
    });

    const { error } = await supabase
      .from("documents")
      .update({ category })
      .eq("id", documentId)
      .eq("user_email_id", user.email);

    if (error) {
      return { success: false, error: `Update error: ${error.message}` };
    }

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateDocumentDetails(
  documentId: string,
  fileName: string,
  category: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("updateDocumentDetails called with:", {
      documentId,
      fileName,
      category,
    });
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // First verify the document exists and belongs to the user
    const { data: existingDoc, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    console.log("existingDoc", existingDoc);

    if (fetchError || !existingDoc) {
      console.error("Document not found or access denied:", fetchError);
      return { success: false, error: "Document not found or access denied" };
    }

    console.log("Document found, proceeding with update...");

    console.log("updating document with:", {
      documentId,
      fileName,
      category,
    });

    const { data, error } = await supabase
      .from("documents")
      .update({
        file_name: fileName,
        category,
      })
      .eq("id", documentId)
      .maybeSingle();

    if (error) {
      console.error("Database update error:", error);
      return { success: false, error: `Update error: ${error.message}` };
    }

    console.log("Database update successful", data);

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
