const fs = require("fs")
const path = require("path")

// Đường dẫn đến thư mục app/api
const apiDir = path.join(process.cwd(), "app", "api")

// Hàm đệ quy để tìm và xóa thư mục [[...path]]
function removeCatchAllRoutes(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Thư mục không tồn tại: ${dir}`)
    return
  }

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      if (item.name === "[[...path]]") {
        console.log(`Tìm thấy thư mục catch-all: ${fullPath}`)
        // Xóa thư mục và tất cả nội dung bên trong
        fs.rmSync(fullPath, { recursive: true, force: true })
        console.log(`Đã xóa thư mục: ${fullPath}`)
      } else {
        // Tiếp tục tìm kiếm đệ quy trong thư mục con
        removeCatchAllRoutes(fullPath)
      }
    }
  }
}

// Bắt đầu tìm kiếm và xóa từ thư mục app/api
try {
  console.log("Bắt đầu tìm kiếm và xóa các thư mục catch-all...")
  removeCatchAllRoutes(apiDir)
  console.log("Hoàn thành!")
} catch (error) {
  console.error("Lỗi:", error)
}
