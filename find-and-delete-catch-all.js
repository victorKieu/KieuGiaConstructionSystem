const fs = require("fs")
const path = require("path")

// Đường dẫn thư mục gốc của dự án
const rootDir = process.cwd()
const apiDir = path.join(rootDir, "app", "api")

// Hàm kiểm tra xem một thư mục có phải là catch-all không
function isCatchAllDir(dirName) {
  return dirName.startsWith("[[...") || dirName.startsWith("[...")
}

// Hàm đệ quy để tìm tất cả các thư mục catch-all
function findCatchAllDirs(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (isCatchAllDir(entry.name)) {
        results.push(fullPath)
      } else {
        findCatchAllDirs(fullPath, results)
      }
    }
  }

  return results
}

// Hàm xóa một thư mục và tất cả nội dung bên trong
function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
    console.log(`Đã xóa thư mục: ${dir}`)
  }
}

// Tìm tất cả các thư mục catch-all
console.log("Đang tìm các thư mục catch-all...")
const catchAllDirs = findCatchAllDirs(apiDir)

if (catchAllDirs.length === 0) {
  console.log("Không tìm thấy thư mục catch-all nào.")
} else {
  console.log(`Tìm thấy ${catchAllDirs.length} thư mục catch-all:`)
  catchAllDirs.forEach((dir) => console.log(`- ${dir}`))

  // Xóa tất cả các thư mục catch-all tùy chọn ([[...]])
  const optionalCatchAllDirs = catchAllDirs.filter((dir) => path.basename(dir).startsWith("[[..."))

  if (optionalCatchAllDirs.length > 0) {
    console.log(`\nĐang xóa ${optionalCatchAllDirs.length} thư mục catch-all tùy chọn...`)
    optionalCatchAllDirs.forEach((dir) => deleteDirectory(dir))
    console.log("Đã xóa tất cả các thư mục catch-all tùy chọn.")
  }
}

// Kiểm tra xem thư mục app/api/[[...path]] có tồn tại không
const pathDir = path.join(apiDir, "[[...path]]")
if (fs.existsSync(pathDir)) {
  console.log(`\nThư mục ${pathDir} vẫn tồn tại. Đang xóa...`)
  deleteDirectory(pathDir)
  console.log(`Đã xóa thư mục ${pathDir}.`)
}

console.log("\nHoàn tất!")
