import fs from "fs/promises"
import path from "path"

async function findCatchAllRoutes(dir) {
  const results = []

  async function scan(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        // Check if directory name contains catch-all pattern
        if (entry.name.includes("[...") || entry.name.includes("[[...")) {
          results.push(fullPath)
        }

        // Continue scanning subdirectories
        await scan(fullPath)
      }
    }
  }

  await scan(dir)
  return results
}

// Start scanning from the app directory
const appDir = "./app"
try {
  const catchAllRoutes = await findCatchAllRoutes(appDir)
  console.log("Found catch-all routes:")
  catchAllRoutes.forEach((route) => console.log(route))
} catch (error) {
  console.error("Error scanning directories:", error)
}
