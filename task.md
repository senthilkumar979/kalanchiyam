Project Plan: Personal Finance & Document Management App
Project Stack: Next.js (App Router), Vercel, Supabase, Resend, Tailwind CSS

Goal: Build a private, invite-only web application for managing personal finances and documents for a small group (you and your wife). The project will be open source on GitHub.

Development Environment: Cursor (or any preferred IDE)

🚀 Phase 1: Authentication & User Setup

Task 1.1: Database Schema for User Profiles
Objective: Define the core database schema for user profiles and the invite system.

Steps for Cursor:

Supabase SQL: Write and run SQL commands to create a profiles table to store user metadata linked to auth.users.

The table should have id, name, and avatar_url fields.

Enable Row Level Security (RLS) on this table.

Create RLS policies to allow users to select and update their own profile.

Supabase SQL: Create an invites table to manage who can be invited.

The table should have id, email (unique), and invited_at.

Task 1.2: Invite-Only Authentication Flow
Objective: Implement the secure, invite-only login and signup flow using Supabase and Resend.

Steps for Cursor:

Disable Public Signup: Provide instructions on how to disable public email signups in the Supabase dashboard.

Configure Resend: Provide instructions on how to set up Resend as the SMTP provider for Supabase.

Server-Side Supabase Admin Client: Create a server-side Supabase client (lib/supabase/admin.ts) using the SUPABASE_SERVICE_ROLE_KEY for admin-level actions.

Invite User Page: Create a protected page (src/app/invite-user/page.tsx) with a form to invite a new user.

Implement a Next.js Server Action to handle the form submission.

The server action should call supabase.auth.admin.inviteUserByEmail() with the provided email address.

Auth Callback Route: Create an API Route
(src/app/auth/callback/route.ts) to handle the URL redirection after a user clicks the magic link in the invitation email.
This route will manage the user session.

Protect Private Routes: Implement middleware to protect all private application routes and redirect unauthenticated users to a login page.

📑 Phase 2: Document Management
Task 2.1: Database Schema for Documents
Objective: Design the database table for storing document metadata.

Steps for Cursor:

Write and run SQL to create a documents table.

The table should include: id, user_id (foreign key to profiles), file_name, storage_path, category (optional), and uploaded_at.

Enable RLS on this table.

Task 2.2: Document Upload and Retrieval
Objective: Build the functionality to upload and download documents.

Steps for Cursor:

Supabase Storage Bucket: Provide instructions to create a new storage bucket (e.g., personal_docs) in Supabase.

Upload Component: Create a React component with a file input. Use the Supabase client library to handle the file upload to the personal_docs bucket and simultaneously save the file metadata to the documents table.

Download Server Action: Create a Server Action that takes a document ID and returns a pre-signed URL from Supabase Storage for secure downloading.

💵 Phase 3: Financial Tracking & Reminders
Task 3.1: Database Schema for Finances
Objective: Create tables for subscriptions, loans, and other financial entries.

Steps for Cursor:

Write and run SQL to create a financial_entries table.

The table should include: id, user_id, name, amount, type (as an enum of subscription, loan_emi, etc.), due_date, and is_paid.

Task 3.2: Listing & Reminder System
Objective: Display the financial entries and send reminder emails.

Steps for Cursor:

Dashboard UI: Build a page to display a list of all financial entries from the financial_entries table.

Reminder Function: Create a Vercel Edge Function or Supabase Edge Function that runs on a daily schedule (cron job).

The function should query the financial_entries table for upcoming due dates.

The function should use the Resend API to send a reminder email for each due entry.

🔒 Phase 4: Audit Trail / Activity Log
Task 4.1: Database Schema & Triggers
Objective: Automatically log all major actions within the application.

Steps for Cursor:

Write and run SQL to create an audit_log table with id, user_id, action, description, and created_at.

Create a Supabase Database Trigger that automatically inserts a new row into the audit_log table whenever a user uploads a new document or marks a financial entry as paid.

📝 Phase 5: Markdown Note-Taking
Task 5.1: Database & UI for Notes
Objective: Enable users to create and manage Markdown notes.

Steps for Cursor:

Write and run SQL to create a notes table with id, user_id, title, and content (as a text field for the Markdown).

Create a UI component with a Markdown editor (e.g., using react-markdown or similar library).

Implement Server Actions for creating, reading, updating, and deleting notes.

✅ Phase 6: Finalization & Polish
Task 6.1: Deployment and Open Source Readiness
Objective: Prepare the project for open source release and long-term use.

Steps for Cursor:

Write a comprehensive README.md file explaining the project, its features, and setup instructions.

Add a LICENSE file (MIT License recommended) to the repository.

Review the code to ensure all sensitive information is handled via environment variables and is not hardcoded.
