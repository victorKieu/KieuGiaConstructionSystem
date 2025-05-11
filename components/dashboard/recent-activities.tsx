export function RecentActivities() {
  // Mẫu dữ liệu hoạt động gần đây
  const activities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "đã tạo dự án mới",
      target: "Chung cư Sunshine",
      time: "2 giờ trước",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "đã cập nhật tiến độ dự án",
      target: "Biệt thự Green Valley",
      time: "3 giờ trước",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "đã thêm vật tư mới",
      target: "Xi măng Portland",
      time: "5 giờ trước",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "đã tạo khách hàng mới",
      target: "Công ty TNHH XYZ",
      time: "1 ngày trước",
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      action: "đã xuất kho vật tư",
      target: "Thép xây dựng",
      time: "1 ngày trước",
    },
  ]

  if (activities.length === 0) {
    return <p className="text-muted-foreground">Không có hoạt động gần đây</p>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
          <div className="flex-1">
            <p>
              <span className="font-medium">{activity.user}</span> {activity.action}{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
