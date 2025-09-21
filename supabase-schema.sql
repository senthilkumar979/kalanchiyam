-- Phase 1: Database Schema for User Management and Invite System

-- Create accounts table for user management
CREATE TABLE IF NOT EXISTS accounts (
  email_id TEXT PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on accounts table
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for accounts table
CREATE POLICY "Users can view all accounts" ON accounts
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own account" ON accounts
  FOR UPDATE USING (email_id = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own account" ON accounts
  FOR INSERT WITH CHECK (email_id = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create invites table
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by TEXT REFERENCES accounts(email_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired'))
);

-- Enable Row Level Security on invites table
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invites table
CREATE POLICY "Users can view invites they created" ON invites
  FOR SELECT USING (invited_by = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create invites" ON invites
  FOR INSERT WITH CHECK (invited_by = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create function to automatically create account on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.accounts (email_id, name)
  VALUES (NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create account
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on accounts
CREATE OR REPLACE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 2: Document Management Schema

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email_id TEXT REFERENCES accounts(email_id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  category TEXT,
  owner TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for owner after table creation
ALTER TABLE documents 
ADD CONSTRAINT documents_owner_fkey 
FOREIGN KEY (owner) REFERENCES accounts(email_id) ON DELETE CASCADE;

-- Enable Row Level Security on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents table
CREATE POLICY "Authenticated users can view all documents" ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert documents with their email" ON documents
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    user_email_id = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Authenticated users can update all documents" ON documents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete all documents" ON documents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at on documents
CREATE OR REPLACE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
