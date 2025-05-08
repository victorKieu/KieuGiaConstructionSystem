// Lấy danh sách phòng ban
export function getDepartments() {
  return [
    "Ban giám đốc",
    "Phòng kỹ thuật",
    "Phòng thi công",
    "Phòng thiết kế",
    "Phòng dự án",
    "Phòng kinh doanh",
    "Phòng tài chính kế toán",
    "Phòng hành chính nhân sự",
    "Phòng vật tư thiết bị",
  ]
}

// Lấy danh sách chức vụ
export function getPositions() {
  return [
    "Giám đốc",
    "Phó giám đốc",
    "Trưởng phòng",
    "Phó phòng",
    "Kỹ sư xây dựng",
    "Kỹ sư thiết kế",
    "Kiến trúc sư",
    "Giám sát công trình",
    "Chỉ huy trưởng",
    "Kế toán trưởng",
    "Kế toán viên",
    "Nhân viên kinh doanh",
    "Nhân viên hành chính",
    "Nhân viên vật tư",
    "Công nhân",
  ]
}

// Lấy danh sách trạng thái
export function getStatuses() {
  return ["Đang làm việc", "Nghỉ phép", "Nghỉ không lương", "Đã nghỉ việc"]
}
