"use server"

import { createServerSupabaseClient } from "./supabase/server"

export async function checkEnvironmentVariables() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing",
    NODE_ENV: process.env.NODE_ENV || "missing",
  }

  return envVars
}

export async function testSupabaseConnection() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("customers").select("id").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      details: error,
    }
  }
}
