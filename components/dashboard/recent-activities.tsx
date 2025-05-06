"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Dữ liệu mẫu cho hoạt động gần đây
const activities = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    action: "đã tạo dự án mới",
    target: "Chung cư Kiều Gia",
    time: "2 giờ trước",
    userInitials: "NA",
  },
  {
    id: "2",
    user: "Trần Thị B",
    action: "đã cập nhật tiến độ dự án",
    target: "Nhà phố Thủ Đức",
    time: "3 giờ trước",
    userInitials: "TB",
  },
  {
    id: "3",
    user: "Lê Văn C",
    action: "đã thêm vật tư mới",
    target: "Xi măng Portland",
    time: "5 giờ trước",
    userInitials: "LC",
  },
  {
    id: "4",
    user: "Phạm Thị D",
    action: "đã tạo yêu cầu mua hàng",
    target: "YC-2023-001",
    time: "6 giờ trước",
    userInitials: "PD",
  },
  {
    id: "5",
    user: "Hoàng Văn E",
    action: "đã phê duyệt yêu cầu mua hàng",
    target: "YC-2023-001",
    time: "7 giờ trước",
    userInitials: "HE",
  },
]

export function RecentActivities() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.userInitials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span> {activity.action}{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
