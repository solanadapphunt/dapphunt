# Authentication Setup Guide

## Google OAuth Setup

To enable Google authentication, you need to set up a Google OAuth application:

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

### 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 4. Update Database Schema

The authentication system uses the existing Prisma schema. Make sure your database is up to date:

```bash
npx prisma db push
```

### 5. Test Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign In" to test Google OAuth
4. After signing in, you should see your profile in the header dropdown

## Features Included

✅ **Google OAuth Login/Logout**  
✅ **Session Management** - Persistent login state  
✅ **User Profiles** - Auto-generated usernames  
✅ **Protected Routes** - Admin panel requires login  
✅ **Real User Voting** - Votes tied to actual users  
✅ **Submission Authentication** - Only logged-in users can submit  

## Next Steps

- Add more OAuth providers (GitHub, Discord, etc.)
- Implement user roles and permissions
- Add email verification
- Create user settings page
- Add social features (following, notifications)

## Troubleshooting

**"Invalid client" error**: Check your Google Client ID and Secret  
**"Redirect URI mismatch"**: Ensure your redirect URIs match exactly  
**Database errors**: Run `npx prisma db push` to sync schema  
**Session issues**: Clear browser cookies and restart dev server 