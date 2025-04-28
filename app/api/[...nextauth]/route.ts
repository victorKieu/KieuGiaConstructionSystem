import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/db"

// Tạo cấu hình NextAuth độc lập với Supabase
const handler = NextAuth({
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

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
          }
        } catch (error) {
          console.error("Lỗi khi xác thực người dùng:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
