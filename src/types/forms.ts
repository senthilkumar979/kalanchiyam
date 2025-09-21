import { z } from "zod";

// Account Management Forms
export const accountSchema = z.object({
  email_id: z.string().email("Please enter a valid email address"),
});

export const editAccountSchema = z.object({
  email_id: z.string().email("Please enter a valid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
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
export type EditAccountFormData = z.infer<typeof editAccountSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;
export type DocumentCategoryFormData = z.infer<typeof documentCategorySchema>;
