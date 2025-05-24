import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = user.id
        // Get username from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true }
        })
        session.user.username = dbUser?.username
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Auto-generate username if not exists
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existingUser && !existingUser.username) {
          const baseUsername = user.email.split('@')[0]
          let username = baseUsername
          let counter = 1
          
          // Check if username exists, if so, append number
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`
            counter++
          }
          
          // Update user with generated username
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { username }
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 