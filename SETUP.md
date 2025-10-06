# ChatGPT Project Setup Guide

This guide will help you set up Google Authentication with Supabase for your ChatGPT project.

## Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Console project
- A Supabase account

## 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields
   - Add your domain to authorized domains
6. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret

## 2. Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Go to the SQL Editor and run the provided `supabase-schema.sql` script
3. Go to Settings → API and copy:
   - Project URL
   - Anon public key
   - Service role key (for server-side operations)

## 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 4. Database Schema

The project includes a SQL file (`supabase-schema.sql`) that creates the necessary tables:

- `users` - Stores user information from Google OAuth
- `conversations` - Stores chat conversations
- `messages` - Stores individual messages in conversations

Run this script in your Supabase SQL Editor.

## 5. Installation and Running

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 6. Testing the Authentication

1. Open `http://localhost:3000`
2. You should see a login modal
3. Click "Continue with Google"
4. Complete the Google OAuth flow
5. You should be redirected to the chat page
6. Check your Supabase database to see if user data was saved

## Features

- ✅ Google OAuth authentication
- ✅ User data storage in Supabase
- ✅ Beautiful login modal
- ✅ Automatic redirect to chat after login
- ✅ Session management with NextAuth
- ✅ Responsive design
- ✅ Dark mode support

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**: Make sure your Google OAuth redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`

2. **Supabase connection error**: Verify your environment variables are correct and your Supabase project is active

3. **NextAuth secret error**: Generate a random string for `NEXTAUTH_SECRET` (you can use: `openssl rand -base64 32`)

4. **Database permission errors**: Make sure you've run the SQL schema and that RLS policies are set up correctly

### Environment Variables Validation:

Make sure all required environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Production Deployment

For production deployment:

1. Update your Google OAuth redirect URIs to include your production domain
2. Update `NEXTAUTH_URL` to your production domain
3. Set up proper environment variables in your hosting platform
4. Make sure your Supabase project is configured for production

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Regularly rotate your API keys
- Monitor your Supabase usage and set up proper RLS policies