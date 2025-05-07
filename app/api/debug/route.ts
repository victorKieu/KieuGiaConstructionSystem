import { NextResponse } from "next/server"
import { checkEnvironmentVariables, testSupabaseConnection } from "@/lib/debug"

export async function GET() {
  try {
    const envVars = await checkEnvironmentVariables()
    const dbTest = await testSupabaseConnection()

    return NextResponse.json({
      status: "ok",
      environment: envVars,
      database: dbTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
