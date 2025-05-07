const fs = require("fs")
const path = require("path")

// Thư mục gốc của dự án
const rootDir = process.cwd()
const apiDir = path.join(rootDir, "app", "api")

// Hàm đệ quy để tìm tất cả các thư mục catch-all
function findCatchAllRoutes(dir) {
  const results = []

  // Đọc tất cả các mục trong thư mục
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const itemPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      // Kiểm tra xem thư mục có phải là catch-all route không
      if (item.name.startsWith("[[...") || item.name.startsWith("[...")) {
        results.push(itemPath)
      }

      // Tìm kiếm đệ quy trong thư mục con
      results.push(...findCatchAllRoutes(itemPath))
    }
  }

  return results
}

// Tìm tất cả các thư mục catch-all trong thư mục API
const catchAllRoutes = findCatchAllRoutes(apiDir)

console.log("Các route catch-all đã tìm thấy:")
catchAllRoutes.forEach((route) => console.log(route))

// Xóa thư mục [[...path]] nếu tồn tại
const pathRouteDir = path.join(apiDir, "[[...path]]")
if (fs.existsSync(pathRouteDir)) {
  console.log(`\nĐang xóa thư mục: ${pathRouteDir}`)
  fs.rmSync(pathRouteDir, { recursive: true, force: true })
  console.log("Đã xóa thành công!")
} else {
  console.log(`\nThư mục ${pathRouteDir} không tồn tại.`)
}

// Kiểm tra xem có còn thư mục catch-all tùy chọn nào khác không
const optionalCatchAllRoutes = catchAllRoutes.filter((route) => path.basename(route).startsWith("[[..."))
if (optionalCatchAllRoutes.length > 0) {
  console.log("\nCác route catch-all tùy chọn khác:")
  optionalCatchAllRoutes.forEach((route) => {
    if (route !== pathRouteDir) {
      console.log(`Đang xóa: ${route}`)
      fs.rmSync(route, { recursive: true, force: true })
      console.log("Đã xóa thành công!")
    }
  })
}

console.log("\nHoàn tất!")
