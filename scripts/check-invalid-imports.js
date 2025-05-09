const fs = require("fs")
const path = require("path")

// Thư mục gốc của dự án
const rootDir = path.resolve(__dirname, "..")

// Hàm kiểm tra một file
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g
    const requireRegex = /require\s*$$\s*['"]([^'"]+)['"]\s*$$/g

    let match
    const imports = []

    // Tìm tất cả các import
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }

    // Tìm tất cả các require
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push(match[1])
    }

    // Kiểm tra từng import
    imports.forEach((importPath) => {
      // Bỏ qua các import từ node_modules
      if (importPath.startsWith(".") || importPath.startsWith("/") || importPath.startsWith("@/")) {
        let resolvedPath

        if (importPath.startsWith("@/")) {
          // Xử lý alias @/
          resolvedPath = path.resolve(rootDir, importPath.replace("@/", ""))
        } else {
          // Xử lý đường dẫn tương đối
          resolvedPath = path.resolve(path.dirname(filePath), importPath)
        }

        // Thêm .ts hoặc .tsx nếu không có phần mở rộng
        if (!path.extname(resolvedPath)) {
          const extensions = [".ts", ".tsx", ".js", ".jsx"]
          let found = false

          for (const ext of extensions) {
            if (fs.existsSync(resolvedPath + ext)) {
              found = true
              break
            }
          }

          if (!found) {
            // Kiểm tra xem có phải là thư mục không
            if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
              console.log(`WARNING: Importing directory in ${filePath}:`)
              console.log(`  Import: ${importPath}`)
              console.log(`  Resolved: ${resolvedPath}`)
              console.log('  This may cause "Invalid file type Directory" error during build')
              console.log("  Consider importing a specific file instead")
              console.log("")
            }
          }
        }
      }
    })
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message)
  }
}

// Hàm duyệt qua tất cả các file trong thư mục
function walkDir(dir) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && file !== "node_modules" && file !== ".next" && file !== ".git") {
      walkDir(filePath)
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
      checkFile(filePath)
    }
  })
}

console.log("Checking for invalid directory imports...")
walkDir(rootDir)
console.log("Done!")
