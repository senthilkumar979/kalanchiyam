# Vercel Blob Storage Setup

To enable avatar uploads, you need to set up Vercel Blob storage:

## 1. Install Vercel Blob

```bash
npm install @vercel/blob
```

## 2. Set up Environment Variables

Add the following environment variable to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

## 3. Get Your Vercel Blob Token

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings > Environment Variables
4. Add a new variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Your Vercel Blob token

### Option B: Using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link your project: `vercel link`
4. Get your token: `vercel env pull .env.local`

## 4. Enable Vercel Blob in Your Project

1. In your Vercel dashboard, go to your project
2. Go to the **Storage** tab
3. Click **Create Database** and select **Blob**
4. Give it a name (e.g., "avatar-storage")
5. Copy the token from the generated environment variable

## 5. Alternative: Use Vercel Blob CLI

```bash
# Install Vercel Blob CLI
npm install -g @vercel/blob

# Login to Vercel
vercel login

# Create a new blob store
vercel blob create

# This will give you the token to use
```

## 6. Deploy

After setting up the environment variable, redeploy your application for the changes to take effect.

## Troubleshooting

### Error: "Cannot get store id or token from authorization header"

- Make sure `BLOB_READ_WRITE_TOKEN` is set in your environment variables
- Verify the token is correct and has proper permissions
- Check that the token is available in your deployment environment

### Error: "File upload service not configured"

- The environment variable is not set
- Check your `.env.local` file and redeploy

## Features

- ✅ File type validation (JPEG, JPG, PNG only)
- ✅ File size validation (max 5MB)
- ✅ Automatic image optimization
- ✅ Secure upload to Vercel Blob
- ✅ URL storage in Supabase database
- ✅ Upload progress indicators
- ✅ Error handling and user feedback
