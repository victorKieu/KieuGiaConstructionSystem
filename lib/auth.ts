import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createClient } from "@/lib/supabase/server-new"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// Export authOptions cho NextAuth.js
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
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
    },
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
}

// Tạo một hàm để lấy session từ NextAuth
export async function getAuthSession() {
  try {
    // Sử dụng getServerSession từ next-auth
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    console.error("Lỗi khi lấy phiên đăng nhập:", error)
    return null
  }
}

// Lấy thông tin người dùng hiện tại từ Supabase (nếu cần)
export async function getCurrentUser() {
  try {
    // Thử lấy từ NextAuth trước
    const session = await getAuthSession()
    if (session?.user) {
      return session.user
    }

    // Nếu không có, thử lấy từ Supabase
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Lỗi khi lấy thông tin người dùng từ Supabase:", error)
        return null
      }
      return data.user
    } catch (supabaseError) {
      console.error("Lỗi khi lấy thông tin người dùng từ Supabase:", supabaseError)
      return null
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error)
    return null
  }
}

// Middleware để kiểm tra xác thực
export async function requireAuth(request) {
  try {
    // Thử lấy từ NextAuth trước
    const session = await getAuthSession()
    if (session) {
      return session
    }

    // Nếu không có, thử lấy từ Supabase
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return data.session
    } catch (supabaseError) {
      console.error("Lỗi khi lấy phiên đăng nhập từ Supabase:", supabaseError)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra xác thực:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// Export biến auth để các file khác có thể import
export const auth = {
  getAuthSession,
  getCurrentUser,
  requireAuth,
}
