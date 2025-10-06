# ChatGPT Clone with Google Authentication

A modern ChatGPT clone built with Next.js 15, featuring Google OAuth authentication, Supabase integration, and AI-powered responses using Google Gemini.

## Features

- ✅ **Google OAuth Authentication** - Secure login with Google
- ✅ **AI-Powered Chat** - Real responses using Google Gemini API
- ✅ **Persistent Login Modal** - Shows when not authenticated
- ✅ **Supabase Integration** - User data storage
- ✅ **Responsive Design** - Works on all devices
- ✅ **Logout Functionality** - Logout button in top right
- ✅ **Session Management** - Persistent sessions with NextAuth
- ✅ **Conversation History** - Maintains context throughout chat

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Authentication**: NextAuth.js with Google Provider
- **AI**: Google Gemini API for chat responses
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment variables** in `.env`:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Gemini AI Configuration
   GEMINI_API_KEY=your-gemini-api-key
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. **Run the development server**: `npm run dev`
5. **Open** [http://localhost:3000](http://localhost:3000)

## Authentication Flow

- **Not Authenticated**: Persistent login modal blocks interaction
- **Google Login**: Click "Continue with Google" to authenticate
- **Authenticated**: Full access to chat interface with logout option

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   └── chat/route.ts                # Chat API endpoint (Gemini integration)
│   ├── chat/
│   │   ├── components/                  # Chat components
│   │   └── page.tsx                     # Main chat page
│   ├── conversation/
│   │   └── page.tsx                     # Conversation page with AI chat
│   └── layout.tsx                       # Root layout
├── components/
│   ├── LoginModal.tsx                   # Authentication modal
│   └── Providers.tsx                    # Session provider
└── lib/
    ├── auth.ts                          # Auth configuration
    ├── supabase.ts                      # Supabase client
    └── utils.ts                         # Utility functions
```

## Development

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production**: `npm start`

## API Configuration

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### Chat API Endpoint

The chat functionality uses the `/api/chat` endpoint which:
- Accepts POST requests with `message` and `conversationHistory`
- Returns AI responses using Google Gemini
- Maintains conversation context
- Handles errors gracefully

## Notes

- Profile picture support is commented out and can be added later
- Supabase table currently stores: `id`, `email`, `name`, `created_at`
- Logout button appears in top right when authenticated
- AI responses are powered by Google Gemini 2.0 Flash model
- Conversation history is maintained throughout the chat session