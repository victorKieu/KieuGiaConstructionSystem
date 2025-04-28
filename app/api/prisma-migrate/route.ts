import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function POST() {
  try {
    console.log("API: Running Prisma migrate...")

    // Chạy lệnh npx prisma generate
    console.log("API: Running npx prisma generate...")
    const { stdout: generateStdout, stderr: generateStderr } = await execPromise("npx prisma generate")

    if (generateStderr) {
      console.error("API: Error running prisma generate:", generateStderr)
      return NextResponse.json(
        {
          success: false,
          error: generateStderr,
        },
        { status: 500 },
      )
    }

    console.log("API: prisma generate output:", generateStdout)

    // Chạy lệnh npx prisma db push
    console.log("API: Running npx prisma db push...")
    const { stdout: pushStdout, stderr: pushStderr } = await execPromise("npx prisma db push --accept-data-loss")

    if (pushStderr) {
      console.error("API: Error running prisma db push:", pushStderr)
      return NextResponse.json(
        {
          success: false,
          error: pushStderr,
        },
        { status: 500 },
      )
    }

    console.log("API: prisma db push output:", pushStdout)

    return NextResponse.json({
      success: true,
      generate: generateStdout,
      push: pushStdout,
    })
  } catch (error) {
    console.error("API: Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
