import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, BarChart3, Package, Truck } from "lucide-react"

export default function InventoryOverview() {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const inventoryStats = {
    totalItems: 324,
    totalValue: 2500000000,
    lowStockItems: 12,
    pendingOrders: 5,
    totalWarehouses: 2,
    totalCategories: 4,
    totalSuppliers: 8,
    totalEquipment: 45,
  }

  // Dữ liệu cảnh báo tồn kho
  const lowStockAlerts = [
    {
      id: 1,
      name: "Xi măng PCB40",
      code: "VL001",
      currentQuantity: 15,
      minimumQuantity: 20,
      unit: "Tấn",
      warehouse: "Kho chính",
    },
    {
      id: 2,
      name: "Thép xây dựng Φ10",
      code: "VL003",
      currentQuantity: 8,
      minimumQuantity: 10,
      unit: "Tấn",
      warehouse: "Kho chính",
    },
    {
      id: 3,
      name: "Gạch ốp lát 60x60",
      code: "VL004",
      currentQuantity: 180,
      minimumQuantity: 200,
      unit: "M2",
      warehouse: "Kho chính",
    },
  ]

  // Dữ liệu giao dịch gần đây
  const recentTransactions = [
    {
      id: 1,
      type: "Nhập kho",
      itemName: "Xi măng PCB40",
      quantity: 50,
      unit: "Tấn",
      date: "2023-05-15",
      supplier: "Công ty TNHH Vật liệu XD ABC",
      project: null,
    },
    {
      id: 2,
      type: "Xuất kho",
      itemName: "Thép xây dựng Φ10",
      quantity: 5,
      unit: "Tấn",
      date: "2023-05-14",
      supplier: null,
      project: "Chung cư ABC",
    },
    {
      id: 3,
      type: "Xuất kho",
      itemName: "Gạch ốp lát 60x60",
      quantity: 200,
      unit: "M2",
      date: "2023-05-13",
      supplier: null,
      project: "Biệt thự XYZ",
    },
    {
      id: 4,
      type: "Nhập kho",
      itemName: "Dây điện 2x1.5",
      quantity: 1000,
      unit: "Mét",
      date: "2023-05-12",
      supplier: "Công ty CP Thiết bị XD XYZ",
      project: null,
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng vật tư</p>
                <h3 className="text-2xl font-bold">{inventoryStats.totalItems}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Giá trị tồn kho</p>
                <h3 className="text-2xl font-bold">{formatCurrency(inventoryStats.totalValue)}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vật tư sắp hết</p>
                <h3 className="text-2xl font-bold">{inventoryStats.lowStockItems}</h3>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Đơn hàng chờ</p>
                <h3 className="text-2xl font-bold">{inventoryStats.pendingOrders}</h3>
              </div>
              <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                <Truck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo tồn kho thấp</CardTitle>
            <CardDescription>Các vật tư có số lượng dưới mức tối thiểu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-red-100 p-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      {/* Thay đổi từ <p> thành <div> để tránh lỗi */}
                      <div className="font-medium">
                        {alert.name} <Badge variant="outline">{alert.code}</Badge>
                      </div>
                      <Badge variant="destructive">Cần nhập thêm</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Hiện tại: {alert.currentQuantity} {alert.unit} (Tối thiểu: {alert.minimumQuantity} {alert.unit})
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Kho: {alert.warehouse}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Các giao dịch nhập xuất kho gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.type === "Nhập kho" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {transaction.type === "Nhập kho" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 19V5" />
                        <path d="m5 12 7-7 7 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      {/* Thay đổi từ <p> thành <div> để tránh lỗi */}
                      <div className="font-medium">{transaction.itemName}</div>
                      <Badge variant={transaction.type === "Nhập kho" ? "outline" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Số lượng: {transaction.quantity} {transaction.unit}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {transaction.type === "Nhập kho"
                        ? `Nhà cung cấp: ${transaction.supplier}`
                        : `Dự án: ${transaction.project}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Ngày: {new Date(transaction.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalWarehouses}</div>
            <p className="text-xs text-gray-500">Kho vật liệu và thiết bị</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Danh mục vật tư</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalCategories}</div>
            <p className="text-xs text-gray-500">Các loại danh mục vật tư</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalSuppliers}</div>
            <p className="text-xs text-gray-500">Đối tác cung cấp vật tư</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalEquipment}</div>
            <p className="text-xs text-gray-500">Thiết bị xây dựng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
