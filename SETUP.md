# Kalanchiyam Setup Instructions

## Phase 1: Authentication & User Setup

### Prerequisites

1. **Supabase Project Setup**

   - Create a new project at [supabase.com](https://supabase.com)
   - Note down your project URL and anon key from Settings > API
   - Get your service role key from Settings > API (keep this secret!)

2. **Resend Account Setup**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Verify your domain (optional but recommended for production)

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. **Run the SQL Schema**

   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create the required tables and policies

2. **Configure Authentication**

   - Go to Authentication > Settings in your Supabase dashboard
   - Disable "Enable email confirmations" (since we're using invite-only)
   - Set "Site URL" to `http://localhost:3000` (or your production URL)
   - Add `http://localhost:3000/auth/callback` to "Redirect URLs"

3. **Configure Email Settings (Optional)**
   - Go to Authentication > Settings > SMTP Settings
   - Configure Resend as your SMTP provider:
     - Host: `smtp.resend.com`
     - Port: `587`
     - Username: `resend`
     - Password: Your Resend API key
     - Sender email: `noreply@yourdomain.com` (must be verified in Resend)

### Installation & Running

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to the login page
   - Use the invite system to create your first user account

### Testing the Email Whitelist System

1. **Add Allowed Email Addresses**

   - Go to your Supabase dashboard > Table Editor
   - Navigate to the `accounts` table
   - Add your email address with `is_active: true`
   - Example: `INSERT INTO accounts (email_id, is_active) VALUES ('your-email@example.com', true);`

2. **Test Login with Whitelisted Email**

   - Go to `/login` and enter your whitelisted email
   - You should receive a magic link
   - Test with a non-whitelisted email to verify it's blocked

3. **Manage Accounts via UI**
   - Once logged in, go to `/admin/accounts`
   - Add, activate, deactivate, or delete email addresses
   - Test the functionality by toggling account status

### Testing the Invite System

1. **Create Your First User**

   - Since there are no users yet, you'll need to manually create the first user
   - Go to your Supabase dashboard > Authentication > Users
   - Click "Add user" and create a user with your email
   - Set a password or use magic link

2. **Invite Additional Users**
   - Once logged in, go to `/invite-user`
   - Enter email addresses to send invitations
   - Users will receive magic links via email

### Security Notes

- The service role key has admin privileges - keep it secure
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- The invite system prevents unauthorized signups

### Troubleshooting

1. **Authentication Issues**

   - Check that your Supabase URL and keys are correct
   - Verify redirect URLs are properly configured
   - Ensure RLS policies are created correctly

2. **Email Issues**

   - Verify Resend API key is correct
   - Check that your domain is verified in Resend
   - Check Supabase logs for email sending errors

3. **Database Issues**
   - Ensure all SQL from `supabase-schema.sql` was executed
   - Check that RLS policies are active
   - Verify foreign key relationships are correct
