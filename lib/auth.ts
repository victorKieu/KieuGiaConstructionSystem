import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// Export biến auth để các file khác có thể import
export const auth = {
    getSession,
    getCurrentUser,
    requireAuth,
}

// Export authOptions cho NextAuth.js
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/error",
    },
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
            },
        },
    ],
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

// Kiểm tra xem người dùng đã đăng nhập chưa
export async function getSession() {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            throw error
        }
        return data.session
    } catch (error) {
        console.error("Lỗi khi lấy phiên đăng nhập:", error)
        return null
    }
}

// Lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        }
        return data.user
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error)
        return null
    }
}

// Middleware để kiểm tra xác thực
export async function requireAuth(request) {
    const session = await getSession()
    if (!session) {
        // Thay vì sử dụng redirect từ next/navigation, sử dụng NextResponse.redirect
        return NextResponse.redirect(new URL("/login", request.url))
    }
    return session
}
