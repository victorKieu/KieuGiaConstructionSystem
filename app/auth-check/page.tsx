"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function AuthCheckPage() {
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean
    user: any | null
    loading: boolean
    error: string | null
  }>({
    authenticated: false,
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        // Kiểm tra phiên đăng nhập từ client
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setAuthStatus({
          authenticated: !!data.session,
          user: data.session?.user || null,
          loading: false,
          error: null,
        })

        // Kiểm tra phiên đăng nhập từ server
        const response = await fetch("/api/auth-debug")
        const serverAuthData = await response.json()

        console.log("Server auth data:", serverAuthData)
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthStatus({
          authenticated: false,
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    checkAuth()
  }, [])

  if (authStatus.loading) {
    return <div className="p-8">Đang kiểm tra trạng thái xác thực...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra trạng thái xác thực</h1>

      {authStatus.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Lỗi</p>
          <p>{authStatus.error}</p>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <p className="font-semibold">
          Trạng thái xác thực: {authStatus.authenticated ? "Đã đăng nhập" : "Chưa đăng nhập"}
        </p>

        {authStatus.authenticated && authStatus.user && (
          <div className="mt-4">
            <p className="font-semibold">Thông tin người dùng:</p>
            <pre className="bg-gray-200 p-2 mt-2 rounded overflow-auto">{JSON.stringify(authStatus.user, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={async () => {
            const response = await fetch("/api/auth-debug")
            const data = await response.json()
            console.log("Server auth check:", data)
            alert("Kiểm tra console để xem kết quả")
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Kiểm tra xác thực từ server
        </button>
      </div>
    </div>
  )
}
