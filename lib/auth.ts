import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user) {
          return null
        }

        if (!user.isActive) {
          throw new Error("Tài khoản đã bị vô hiệu hóa")
        }

        const passwordMatch = await compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role,
        },
      }
    },
  },
}
