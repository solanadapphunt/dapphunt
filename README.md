# DappHunt - Solana dApp Discovery Platform

A Product Hunt-style platform for discovering and launching Solana dApps. Built with Next.js, Prisma, and integrated with Solana blockchain functionality.

## 🚀 Features

- **Project Submission & Approval** - Submit dApps for community review
- **Voting System** - Upvote/downvote projects with real user authentication
- **Google OAuth Authentication** - Secure login with Google accounts
- **Admin Panel** - Review and approve submissions
- **Leaderboards** - Ranked lists by hunt score, votes, and time periods
- **Forum Discussions** - Community discussions around projects
- **Solana Integration** - Built-in wallet connection and Solana program interaction
- **Mobile Responsive** - Works great on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: SQLite (development) / PostgreSQL (production) with Prisma ORM
- **Blockchain**: Solana, Anchor Framework
- **UI Components**: Radix UI, Lucide React
- **State Management**: React Query, Jotai

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.18.0 or higher
- **pnpm** package manager
- **Rust** v1.77.2 or higher (for Solana development)
- **Anchor CLI** 0.30.1 or higher
- **Solana CLI** 1.18.17 or higher

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dapphunt
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Required for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="file:./dev.db"
```

**To get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Generate Prisma client and create the database:

```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 5. Start the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 📖 Detailed Setup

### Database Management

**View Database (Optional):**
```bash
npx prisma studio
```

**Reset Database:**
```bash
npx prisma db push --force-reset
npx prisma db seed
```

**Deploy Database Changes:**
```bash
npx prisma db push
```

### Solana Development (Optional)

If you want to work with the Solana program:

**Sync Program ID:**
```bash
pnpm anchor keys sync
```

**Build Solana Program:**
```bash
pnpm anchor-build
```

**Start Local Validator:**
```bash
pnpm anchor-localnet
```

**Run Tests:**
```bash
pnpm anchor-test
```

**Deploy to Devnet:**
```bash
pnpm anchor deploy --provider.cluster devnet
```

## 🧭 Usage Guide

### First Time Setup

1. **Start the app** - Run `pnpm dev`
2. **Sign in** - Click "Sign In" and authenticate with Google
3. **Explore** - Browse existing projects on the home page
4. **Vote** - Click upvote buttons to vote on projects
5. **Submit** - Go to `/submit` to submit your own dApp
6. **Admin** - Visit `/admin` to approve submissions (when signed in)

### Key Routes

- `/` - Home page with top projects
- `/products` - All projects with filtering
- `/submit` - Submit new dApp
- `/admin` - Admin panel for approvals
- `/leaderboard` - Leaderboard rankings
- `/profile` - User profile and submissions
- `/solana` - Solana blockchain features

## 🏗 Project Structure

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── projects/     # Project CRUD operations
│   │   ├── submissions/  # Submission management
│   │   └── ...
│   ├── solana/           # Solana-specific pages
│   └── layout.tsx        # Root layout
├── pages/                 # Pages Router (legacy routes)
│   ├── products.tsx      # Products listing
│   ├── profile.tsx       # User profiles
│   └── _app.tsx         # Pages app wrapper
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── Header.tsx       # Navigation header
│   ├── ProductCard.tsx  # Product display card
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── prisma.ts       # Prisma client
│   └── auth.ts         # Auth utilities
├── providers/          # Context providers
└── types/             # TypeScript definitions

prisma/
├── schema.prisma      # Database schema
├── seed.ts           # Database seeding
└── dev.db           # SQLite database (development)

anchor/               # Solana program code
├── programs/        # Rust programs
├── tests/          # Program tests
└── Anchor.toml     # Anchor configuration
```

## 🔧 Development Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Solana/Anchor
pnpm anchor-build     # Build Solana program
pnpm anchor-test      # Run program tests
pnpm anchor-localnet  # Start local validator
```

## 🎯 Key Features Walkthrough

### Authentication Flow
1. Click "Sign In" → Google OAuth → Automatic account creation
2. Users get auto-generated usernames
3. Session persists across browser restarts

### Project Submission Flow
1. `/submit` → Fill out comprehensive form
2. Submission goes to admin review (`/admin`)
3. Admin approves → Project appears on platform
4. Real-time voting and hunt scores

### Admin Workflow
1. Sign in → Access `/admin`
2. Review pending submissions
3. One-click approval creates live projects
4. Manage platform content

## 🚨 Troubleshooting

**Authentication Issues:**
- Verify Google OAuth credentials in `.env.local`
- Check redirect URIs match exactly
- Clear browser cookies and restart dev server

**Database Issues:**
- Run `npx prisma db push` to sync schema
- Check `DATABASE_URL` in environment variables
- Reset with `npx prisma db push --force-reset`

**Build Errors:**
- Delete `.next` folder and restart
- Check all environment variables are set
- Verify Node.js version compatibility

## 📚 Additional Resources

- [Authentication Setup Guide](./AUTHENTICATION_SETUP.md) - Detailed OAuth setup
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Solana Documentation](https://docs.solana.com)
- [Anchor Framework](https://anchor-lang.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license here]

---

Built with ❤️ for the Solana ecosystem
