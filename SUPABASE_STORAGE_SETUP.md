# Supabase Storage Setup Instructions

## Phase 2: Document Management - Storage Bucket Setup

To complete the document management functionality, you need to set up a Supabase storage bucket for storing uploaded documents.

### Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `personal_docs`
   - **Public**: `No` (keep it private for security)
   - **File size limit**: `10MB` (or adjust as needed)
   - **Allowed MIME types**: Leave empty to allow all types, or specify:
     ```
     application/pdf,image/jpeg,image/png,image/gif,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain
     ```

### Step 2: Configure Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies** in your Supabase dashboard
2. Find the `personal_docs` bucket and click **"New Policy"**
3. Create the following policies:

#### Policy 1: Allow users to upload their own files

- **Policy name**: `Users can upload their own files`
- **Policy definition**:

```sql
((bucket_id = 'personal_docs'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))
```

#### Policy 2: Allow users to view their own files

- **Policy name**: `Users can view their own files`
- **Policy definition**:

```sql
((bucket_id = 'personal_docs'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))
```

#### Policy 3: Allow users to delete their own files

- **Policy name**: `Users can delete their own files`
- **Policy definition**:

```sql
((bucket_id = 'personal_docs'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))
```

### Step 3: Run Database Schema

Make sure to run the updated database schema that includes the documents table:

```bash
# If using Supabase CLI
supabase db reset

# Or run the SQL directly in the Supabase SQL editor
# Copy and paste the contents of supabase-schema.sql
```

### Step 4: Configure Next.js for File Uploads

The Next.js configuration has been updated to allow file uploads up to 10MB. The `next.config.ts` file now includes:

```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '10mb', // Allow up to 10MB file uploads
  },
},
```

**Important**: You need to restart your development server for this configuration to take effect:

```bash
# Stop the current server (Ctrl+C) and restart
npm run dev
```

### Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/documents` in your application
3. Try uploading a test document
4. Verify the document appears in the list
5. Test downloading the document
6. Test deleting the document

### Security Notes

- All files are stored privately and can only be accessed by the user who uploaded them
- File paths include the user ID to ensure proper isolation
- Pre-signed URLs are used for secure downloads with 1-hour expiry
- File size is limited to 10MB by default (configurable in the upload component)

### Troubleshooting

If you encounter issues:

1. **Upload fails**: Check that the storage bucket exists and policies are correctly configured
2. **Download fails**: Verify the pre-signed URL generation is working
3. **Permission denied**: Ensure RLS policies are properly set up
4. **File not found**: Check that the file path in the database matches the storage path

### File Structure

Files are stored in the following structure:

```
personal_docs/
├── {user_id_1}/
│   ├── {timestamp}-{random}.pdf
│   └── {timestamp}-{random}.jpg
├── {user_id_2}/
│   └── {timestamp}-{random}.docx
└── ...
```

This structure ensures that each user's files are isolated and secure.
