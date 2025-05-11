"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    // Lấy các biến môi trường public
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
        : undefined,
      NODE_ENV: process.env.NODE_ENV,
    })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Kiểm tra biến môi trường</CardTitle>
          <CardDescription>Trang này hiển thị các biến môi trường public</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="rounded border p-3">
                <p className="font-medium">{key}:</p>
                <p className="mt-1 text-sm text-gray-600">{value !== undefined ? value : "(không được đặt)"}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/auth-test")} className="w-full">
            Kiểm tra xác thực
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
