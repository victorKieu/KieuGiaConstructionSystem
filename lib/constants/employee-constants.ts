// Danh sách phòng ban
export function getDepartments() {
  return ["Ban giám đốc", "Kế toán", "Nhân sự", "Kỹ thuật", "Kinh doanh", "Dự án", "Kho vận", "Hành chính"]
}

// Danh sách chức vụ
export function getPositions() {
  return [
    "Giám đốc",
    "Phó giám đốc",
    "Trưởng phòng",
    "Phó phòng",
    "Trưởng nhóm",
    "Nhân viên",
    "Kỹ sư",
    "Kiến trúc sư",
    "Kế toán trưởng",
    "Kế toán viên",
    "Quản lý dự án",
    "Quản lý kho",
    "Thủ kho",
  ]
}

// Danh sách trạng thái
export function getStatuses() {
  return [
    { value: "active", label: "Đang làm việc" },
    { value: "on_leave", label: "Nghỉ phép" },
    { value: "terminated", label: "Đã nghỉ việc" },
  ]
}

// Hàm lấy nhãn trạng thái từ giá trị
export function getStatusLabel(status: string) {
  const statusObj = getStatuses().find((s) => s.value === status)
  return statusObj ? statusObj.label : status
}
