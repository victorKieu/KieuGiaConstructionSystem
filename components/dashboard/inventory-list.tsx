// Dữ liệu mẫu cho danh sách vật tư
const inventoryData = [
  {
    id: 1,
    name: "Xi măng Portland",
    quantity: 50,
    unit: "tấn",
    threshold: 100,
  },
  {
    id: 2,
    name: "Thép xây dựng Φ10",
    quantity: 200,
    unit: "thanh",
    threshold: 500,
  },
  {
    id: 3,
    name: "Gạch ốp lát 60x60",
    quantity: 300,
    unit: "m²",
    threshold: 500,
  },
  {
    id: 4,
    name: "Cát xây dựng",
    quantity: 30,
    unit: "m³",
    threshold: 50,
  },
]

export function InventoryList() {
  // Sử dụng dữ liệu mẫu thay vì gọi API
  const inventory = inventoryData

  return (
    <div className="space-y-4">
      {inventory && inventory.length > 0 ? (
        inventory.map((item) => (
          <div key={item.id} className="flex items-center justify-between pb-2 last:pb-0 last:border-0 border-b">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                Còn lại: {item.quantity} {item.unit}
              </div>
            </div>
            <div className="text-sm font-medium text-red-500">
              {Math.round((item.quantity / item.threshold) * 100)}%
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">Không có vật tư nào cần nhập thêm</div>
      )}
    </div>
  )
}
