"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthTestPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cookies, setCookies] = useState<string[]>([])

  useEffect(() => {
    // Kiểm tra session
    async function checkAuth() {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    // Lấy danh sách cookies
    function getCookies() {
      const cookieList = document.cookie.split(";").map((cookie) => cookie.trim())
      setCookies(cookieList)
    }

    checkAuth()
    getCookies()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Kiểm tra xác thực</CardTitle>
          <CardDescription>Trang này hiển thị thông tin về trạng thái xác thực hiện tại</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Trạng thái đăng nhập:</h3>
                <div className="rounded bg-gray-100 p-4">
                  <p className="font-medium">{session ? "Đã đăng nhập" : "Chưa đăng nhập"}</p>
                </div>
              </div>

              {session && (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Thông tin phiên:</h3>
                  <div className="rounded bg-gray-100 p-4">
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(session, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-lg font-semibold">Cookies:</h3>
                <div className="rounded bg-gray-100 p-4">
                  {cookies.length > 0 ? (
                    <ul className="list-inside list-disc space-y-1">
                      {cookies.map((cookie, index) => (
                        <li key={index} className="text-sm">
                          {cookie}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không tìm thấy cookies</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Làm mới
          </Button>
          {session ? (
            <Button variant="destructive" onClick={handleSignOut}>
              Đăng xuất
            </Button>
          ) : (
            <Button onClick={() => (window.location.href = "/login")}>Đến trang đăng nhập</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
