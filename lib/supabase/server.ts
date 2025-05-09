import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createClient = () => {
  // Kiểm tra xem chúng ta có đang ở trong quá trình build không
  const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

  // Nếu đang trong quá trình build, trả về một mock client
  if (isBuildTime) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    }
  }

  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set(name, value, options)
          },
          remove(name, options) {
            cookieStore.set(name, "", { ...options, maxAge: 0 })
          },
        },
      },
    )

    return supabase
  } catch (error) {
    console.error("Error creating Supabase client:", error)

    // Trả về mock client nếu có lỗi
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    }
  }
}
