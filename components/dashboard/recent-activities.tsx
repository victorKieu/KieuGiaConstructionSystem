// Dữ liệu mẫu cho các hoạt động gần đây
const activitiesData = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    action: "đã cập nhật trạng thái dự án",
    project: "Chung cư Sunshine City",
    time: "2 giờ trước",
  },
  {
    id: 2,
    user: "Trần Thị B",
    action: "đã thêm báo cáo tiến độ",
    project: "Khu đô thị Green Park",
    time: "3 giờ trước",
  },
  {
    id: 3,
    user: "Lê Văn C",
    action: "đã phê duyệt yêu cầu vật tư",
    project: "Trung tâm thương mại Diamond Plaza",
    time: "5 giờ trước",
  },
  {
    id: 4,
    user: "Phạm Thị D",
    action: "đã tạo nhiệm vụ mới",
    project: "Nhà máy sản xuất Vinfast",
    time: "1 ngày trước",
  },
  {
    id: 5,
    user: "Hoàng Văn E",
    action: "đã cập nhật ngân sách",
    project: "Chung cư Sunshine City",
    time: "1 ngày trước",
  },
]

export function RecentActivities() {
  // Sử dụng dữ liệu mẫu thay vì gọi API
  const activities = activitiesData

  return (
    <div className="space-y-4">
      {activities && activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start pb-4 last:pb-0 last:border-0 border-b">
            <div className="w-full">
              <div className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                <span className="font-medium">{activity.project}</span>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">Không có hoạt động nào gần đây</div>
      )}
    </div>
  )
}
