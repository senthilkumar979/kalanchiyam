import { z } from "zod";

// Account Management Forms
export const accountSchema = z.object({
  email_id: z.string().email("Please enter a valid email address"),
});

export const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Document Forms
export const documentCategorySchema = z.object({
  category: z.string().min(1, "Category is required"),
});

// Type exports
export type AccountFormData = z.infer<typeof accountSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;
export type DocumentCategoryFormData = z.infer<typeof documentCategorySchema>;
