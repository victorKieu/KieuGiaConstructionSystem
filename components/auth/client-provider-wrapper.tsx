"use client"

import type React from "react"

import dynamic from "next/dynamic"

// Import AuthProvider với chế độ không SSR
const AuthProvider = dynamic(() => import("@/components/auth/auth-provider").then((mod) => mod.AuthProvider), {
  ssr: false,
})

export function ClientProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
